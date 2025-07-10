import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import ChatFooter from "../components/ChatFooter";
// import socket from "../services/socket";
import { useSocket } from '../services/SocketContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get("window");

export default function ChatsScreen() {
  const params = useLocalSearchParams();
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [messages, setMessages] = useState([]);
  const [profileData, setProfileData] = useState({ username: params.receiverName || 'Unknown User', profileImage: params.receiverProfilePic || "https://via.placeholder.com/150", status: "Online", userId: params.receiverID });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const flatListRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const { socket, isConnected } = useSocket();

  // Keyboard visibility handler
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    setProfileData({
      username: params.receiverName || 'Unknown User',
      profileImage: params.receiverProfilePic || "https://via.placeholder.com/150",
      status: "Online", // Default status
      userId: params.receiverID
    });

    const handleStatusUpdate = ({ userId, isOnline }) => {
      if (userId === params.receiverID) {
        setProfileData(prev => ({
          ...prev,
          status: isOnline ? "Online" : "Offline"
        }));
      }
    };

    socket.on('userStatusUpdate', handleStatusUpdate);

    return () => {
      socket.off('userStatusUpdate', handleStatusUpdate);
    };
  }, [params.receiverID]);



  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("User");
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (err) {
        console.log("Error loading user:", err);
      }
    };
    loadUser();
  }, []);

  // Initialize socket and fetch messages
  useEffect(() => {
    if (!currentUser || !params.chatID) return;

    // Connect to socket and join room
    socket.connect();
    socket.emit("joinRoom", { chatID: params.chatID });
    socket.emit("joinChatList", { userID: currentUser.userID });

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/chats/get-messages/${params.chatID}?limit=20&page=1&order=desc`
        );
        if (res.data.success) {
          setMessages(res.data.data.reverse());
          setHasMoreMessages(res.data.data.length === 20);
          markMessagesAsRead();
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Socket event listeners
    socket.on("newMessage", (message) => {
      if (message.chatID === params.chatID) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();

        // Mark as read if it's from the other user
        if (message.senderID !== currentUser.userID) {
          markMessageAsRead(message.messageID);
        }
      }
    });

    socket.on("chatListUpdate", (message) => {
      // Handle chat list updates if needed
    });

    socket.on("typing", ({ userID }) => {
      if (userID !== currentUser.userID) {
        setIsTyping(true);
        setTypingUser(userID);
      }
    });

    socket.on("stopTyping", ({ userID }) => {
      if (userID !== currentUser.userID) {
        setIsTyping(false);
        setTypingUser(null);
      }
    });

    socket.on("messageSeen", ({ messageID }) => {
      setMessages(prev => prev.map(msg =>
        msg.messageID === messageID ? { ...msg, isRead: 1 } : msg
      ));
    });

    socket.on("messageReadAll", ({ chatID }) => {
      if (chatID === params.chatID) {
        setMessages(prev => prev.map(msg =>
          msg.senderID === currentUser.userID ? { ...msg, isRead: 1 } : msg
        ));
      }
    });

    return () => {
      socket.emit("leaveRoom", { chatID: params.chatID });
      socket.off("newMessage");
      socket.off("chatListUpdate");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("messageSeen");
      socket.off("messageReadAll");
      // socket.disconnect();
    };
  }, [params.chatID, currentUser]);

  // Load more messages when scrolling up
  const loadMoreMessages = async () => {
    if (loadingMore || !hasMoreMessages) return;

    try {
      setLoadingMore(true);
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/chats/get-messages/${params.chatID}?limit=20&page=${Math.ceil(messages.length / 20) + 1}&order=desc`
      );
      if (res.data.success && res.data.data.length > 0) {
        setMessages(prev => [...res.data.data.reverse(), ...prev]);
        setHasMoreMessages(res.data.data.length === 20);
      } else {
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.error("Error loading more messages:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Mark all messages as read
  const markMessagesAsRead = async () => {
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/chats/mark-all-read`, {
        receiverID: currentUser.userID,
        chatID: params.chatID,
      });
      socket.emit("readMessage", {
        chatID: params.chatID,
        userID: currentUser.userID
      });
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  // Mark single message as read
  const markMessageAsRead = async (messageID) => {
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/chats/mark-seen`, {
        messageID,
      });
      socket.emit("seenThisMessage", {
        messageID,
        chatID: params.chatID,
        userID: currentUser.userID
      });
    } catch (err) {
      console.error("Error marking message as seen", err);
    }
  };

  // Send message handler
  const sendMessage = async (messageText, messageType = "text") => {
    if (!messageText.trim() || !currentUser) return;

    try {
      const messageData = {
        senderID: currentUser.userID,
        receiverID: params.receiverID,
        chatID: params.chatID,
        message: messageText,
        messageType,
      };

      // Optimistic UI update
      const tempMessage = {
        ...messageData,
        messageID: Date.now().toString(), // Temporary ID
        timestamp: new Date().toISOString(),
        isRead: 0,
        senderName: `${currentUser.userFirstName} ${currentUser.userSurname}`
      };

      setMessages(prev => [...prev, tempMessage]);
      scrollToBottom();

      // Emit via socket
      socket.emit("sendMessage", messageData);
    } catch (err) {
      console.error("Error sending message:", err);
      Alert.alert("Error", "Failed to send message");
    }
  };

  // Send image handler
  const sendImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "We need access to your photos to send images");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: true
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        // In a real app, you would upload the image first
        sendMessage(imageUri, "image");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  // Typing indicators
  const handleTyping = (isTyping) => {
    if (isTyping) {
      socket.emit("typing", {
        chatID: params.chatID,
        userID: currentUser.userID
      });
    } else {
      socket.emit("stopTyping", {
        chatID: params.chatID,
        userID: currentUser.userID
      });
    }
  };

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: false });
      }, 100);
    }
  };

  // Render message item
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderID === currentUser?.userID;

    return (
      <View style={[
        styles.messageRow,
        isCurrentUser ? styles.currentUserRow : styles.otherUserRow
      ]}>
        {!isCurrentUser && (
          <Image
            source={{ uri: profileData.profileImage }}
            style={styles.userAvatar}
          />
        )}

        <View style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
        ]}>
          {item.messageType === 'image' ? (
            <>
              <Image
                source={{ uri: item.message }}
                style={styles.messageImage}
                resizeMode="cover"
              />
              <View style={styles.messageFooter}>
                <Text style={[
                  styles.messageTime,
                  isCurrentUser ? styles.currentUserTime : styles.otherUserTime
                ]}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {isCurrentUser && (
                  <MaterialIcons
                    name={item.isRead ? "done-all" : "done"}
                    size={14}
                    color={item.isRead ? "#4CAF50" : "#A9A9A9"}
                    style={styles.tickIcon}
                  />
                )}
              </View>
            </>
          ) : (
            <View style={styles.messageContent}>
              <Text
                style={[
                  styles.messageText,
                  isCurrentUser ? styles.currentUserText : styles.otherUserText,
                ]}
              >
                {item.message}
              </Text>
              <View style={styles.messageFooter}>
                <Text style={[
                  styles.messageTime,
                  isCurrentUser ? styles.currentUserTime : styles.otherUserTime
                ]}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {isCurrentUser && (
                  <MaterialIcons
                    name={item.isRead ? "done-all" : "done"}
                    size={14}
                    color={item.isRead ? "#4CAF50" : "#A9A9A9"}
                    style={styles.tickIcon}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };


  const handleBackdropPress = () => {
    setShowProfileOptions(false);
    setShowCallOptions(false);
    Keyboard.dismiss();
  };

  const handleBackPress = () => router.back();

  if (loading && messages.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7F50" />
      </View>
    );
  }

  const handleVideoCall = () => {
    console.log("Video call clicked", params);
    
    socket.emit('start-call', {
      to: params.receiverID,
      from: currentUser.userID,
      chatID: params.chatID
    });

    router.push({
      pathname: "../pages/VideoCallScreen",
      params: {
        caller: currentUser.userID,
        receiver: params.receiverID,
        chatID: params.chatID,
        isCaller: true
      },
    });
  };


  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={styles.innerContainer}>
              <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileInfo}
                  onPress={() => setShowProfileOptions(!showProfileOptions)}
                >
                  <Image
                    source={{ uri: profileData.profileImage }}
                    style={styles.profileImage}
                  />
                  <View>
                    <Text style={styles.profileName} numberOfLines={1}>
                      {profileData.username || "User"}
                    </Text>
                    <Text style={styles.profileStatus}>
                      {isTyping ? "Typing..." : profileData.status || "Offline"} {isConnected ? "🟢" : "🔴"}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.callIcons}>
                  <TouchableOpacity onPress={() => setShowCallOptions(!showCallOptions)}>
                    <Ionicons name="call-outline" size={22} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginLeft: 16 }}
                    onPress={() => setShowCallOptions(!showCallOptions)}
                  >
                    <Ionicons name="videocam-outline" size={22} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>

              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) =>
                  item.messageID?.toString() || index.toString()
                }
                renderItem={renderMessage}
                contentContainerStyle={styles.chatArea}
                onContentSizeChange={scrollToBottom}
                onLayout={scrollToBottom}
                onEndReached={loadMoreMessages}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  loadingMore ? (
                    <ActivityIndicator size="small" color="#FF7F50" style={styles.loadMoreIndicator} />
                  ) : null
                }
                ListEmptyComponent={
                  <View style={styles.emptyChatContainer}>
                    <Text style={styles.emptyChatText}>No messages yet</Text>
                    <Text style={styles.emptyChatSubtext}>Start the conversation!</Text>
                  </View>
                }
              />
            </View>
          </TouchableWithoutFeedback>

          {/* Profile Options */}
          {showProfileOptions && (
            <View style={styles.optionsContainer}>
              <OptionItem icon="image" text="Media" />
              <OptionItem icon="user" text="View Profile" />
              <OptionItem icon="share-2" text="Share profile" />
              <OptionItem icon="bell-off" text="Mute Chat" />
              <OptionItem icon="trash-2" text="Delete Chat" />
              <OptionItem icon="flag" text="Report User" />
              <OptionItem icon="x" text="Block" color="#FF3B30" />
            </View>
          )}

          {/* Call Options */}
          {showCallOptions && (
            <View style={styles.optionsContainer}>
              <OptionItem
                onPress={handleVideoCall}
                icon="video"
                text="Premium Match Call"
                subtext="3,000/min"
                coinIcon
              />
            </View>
          )}

          <ChatFooter
            onSendMessage={sendMessage}
            onTyping={handleTyping}
            onAttachPress={() => {
              Alert.alert(
                "Send Attachment",
                "Choose an option",
                [
                  {
                    text: "Photo",
                    onPress: sendImage
                  },
                  {
                    text: "Cancel",
                    style: "cancel"
                  }
                ]
              );
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const OptionItem = ({ icon, text, subtext, coinIcon, color = "#000", onPress }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <Feather name={icon} size={24} color={color} style={styles.optionIcon} />
    <View style={styles.optionTextContainer}>
      <Text style={[styles.optionText, { color }]}>{text}</Text>
      {subtext && (
        <View style={styles.subtextContainer}>
          {coinIcon && <View style={styles.coinIcon} />}
          <Text style={styles.subtext}>{subtext}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  innerContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileStatus: {
    fontSize: 12,
    color: '#666',
  },
  callIcons: {
    flexDirection: 'row',
  },
  chatArea: {
    padding: 15,
    paddingBottom: 80,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  currentUserRow: {
    justifyContent: 'flex-end',
  },
  otherUserRow: {
    justifyContent: 'flex-start',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
  },
  currentUserContainer: {
    backgroundColor: '#FF7F50',
    borderTopRightRadius: 0,
  },
  otherUserContainer: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#000000',
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
  },
  currentUserTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherUserTime: {
    color: '#666',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  optionsContainer: {
    position: 'absolute',
    right: 15,
    top: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 180,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
  },
  subtextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  coinIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    marginRight: 5,
  },
  subtext: {
    fontSize: 12,
    color: '#666',
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyChatText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  emptyChatSubtext: {
    fontSize: 14,
    color: '#999',
  },
  loadMoreIndicator: {
    paddingVertical: 10,
  },

  messageContainer: {
    maxWidth: '80%',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },

  messageContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },

  tickIcon: {
    marginLeft: 4,
  },

  messageText: {
    fontSize: 14,
    marginEnd: 10,
    paddingBottom: 16,
    // lineHeight: 20,
    // flexShrink: 1,
  },

  messageTime: {
    fontSize: 11,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  currentUserContainer: {
    backgroundColor: '#FF7F50',
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  otherUserContainer: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 4,
    alignSelf: 'flex-end',
  },
});