import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import Header from "../components/header";
import Footer from "../components/footer";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const ChatList = () => {
  const [user, setUser] = useState({});
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userID, isMessage } = useLocalSearchParams();
  const router = useRouter();

  const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user?.userID) {
      fetchChatList();
    }
  }, [user]);

  const getUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("User");
      const parsedUser = JSON.parse(storedUser);
      console.log("User:", parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.log("Error loading user:", error);
    }
  };

  const fetchChatList = async () => {
    if (!user?.userID) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/chats/get-chat-list/${user.userID}`
      );

      const chatsWithUnreadCounts = await Promise.all(
        response.data.data.map(async (chat) => {
          try {
            const messagesResponse = await axios.get(
              `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/chats/get-messages/${chat.chatID}`
            );

            const unreadCount = messagesResponse.data.data.reduce(
              (count, message) => {
                return (
                  count +
                  (message.isRead === 0 && message.senderID !== user.userID
                    ? 1
                    : 0)
                );
              },
              0
            );

            return { ...chat, unreadCount };
          } catch (error) {
            console.log(
              `Error fetching messages for chat ${chat.chatID}:`,
              error
            );
            return { ...chat, unreadCount: 0 };
          }
        })
      );

      setChatList(chatsWithUnreadCounts);
    } catch (error) {
      console.log("Error fetching chat list:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChatList();
  }, []);

  const markMessagesAsRead = async (chatID) => {
    try {
      await axios.patch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/chats/mark-as-read`,
        { chatID, userID: user.userID }
      );

      setChatList((prevChatList) =>
        prevChatList.map((chat) =>
          chat.chatID === chatID ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (error) {
      console.log("Error marking messages as read:", error);
    }
  };

  const renderChatItem = ({ item }) => {
    console.log("item = ",  );

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          markMessagesAsRead(item.chatID);
          router.push({
            pathname: "../pages/ChatsScreen",
            params: {
              chatID: item.chatID,
              receiverID: item.receiverUserID || item.chatWith,
              receiverName: item.chatName,
              receiverProfilePic: item.profilePic 
                ? `${BASE_URL}${item.profilePic}`
                : "https://i.pravatar.cc/150?img=3",
              chatType: item.chatType,
              },
          });
        }}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: item.profilePic
                ? `${BASE_URL}${item.profilePic}`
                : "https://i.pravatar.cc/150?img=3",
            }}
            style={styles.avatar}
          />
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {item.chatName}
            </Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime(item.recentMessageTimestamp)}
              </Text>
              {item.unreadCount > 0 && <View style={styles.unreadIndicator} />}
            </View>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.recentMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Messages" showBackButton={false} />
        <View style={styles.container}>
          {loading && chatList.length === 0 ? (
            <ActivityIndicator
              size="large"
              color="#FF7F50"
              style={styles.loader}
            />
          ) : chatList.length > 0 ? (
            <FlatList
              data={chatList}
              keyExtractor={(item) => item.chatID}
              renderItem={renderChatItem}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#FF7F50"]}
                  tintColor="#FF7F50"
                />
              }
              ListFooterComponent={<View style={styles.footerSpacer} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbubbles-outline"
                size={80}
                color="#D3D3D3"
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>
                Start a conversation with your friends
              </Text>
            </View>
          )}
        </View>
        <Footer />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E0E0E0",
  },
  unreadBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#888",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    marginLeft: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  loader: {
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  footerSpacer: {
    height: 20,
  },
});

export default ChatList;
