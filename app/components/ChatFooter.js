import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
  Dimensions,
  Animated,
  Easing,
  Text,
  FlatList,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import GiftCoinPopup from "./GiftCoinPopup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const mediaOptions = [
  { id: "1", icon: "image", name: "Photo", component: Ionicons },
  { id: "2", icon: "camera", name: "Camera", component: Ionicons },
  // { id: '3', icon: 'gif', name: 'GIF', component: MaterialCommunityIcons },
];

const ChatFooter = ({ onSendMessage, receiverID }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const scaleAnim = new Animated.Value(1);
  const [senderId, setSenderId] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await AsyncStorage.getItem("User");
        if (user) {
          const parsedUser = JSON.parse(user);
          setSenderId(parsedUser.userID);
        }
      } catch (error) {
        console.error("Error fetching user from AsyncStorage:", error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const toggleMediaOptions = () => {
    setShowMediaOptions(!showMediaOptions);
  };

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderMediaOption = ({ item }) => {
    const IconComponent = item.component;
    return (
      <TouchableOpacity
        style={styles.mediaOption}
        onPress={() => {
          // Handle the option
          console.log(`${item.name} pressed`);
          setShowMediaOptions(false);
        }}
      >
        <IconComponent name={item.icon} size={24} color="#FF7F50" />
        <Text style={styles.mediaOptionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const hasText = message.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Media Options Panel */}
      {showMediaOptions && (
        <FlatList
          data={mediaOptions}
          renderItem={renderMediaOption}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={styles.mediaOptionsContainer}
          showsHorizontalScrollIndicator={false}
        />
      )}

      {/* Main Input Bar */}
      <View style={styles.inputContainer}>
        {/* Media Button */}
        <TouchableOpacity
          style={styles.mediaButton}
          onPress={toggleMediaOptions}
        >
          <Ionicons
            name={showMediaOptions ? "close" : "add"}
            size={24}
            color="#FF7F50"
          />
        </TouchableOpacity>

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          multiline
          maxHeight={100}
        />

        {/* Right Action Buttons */}
        {hasText ? (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.rightButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setShowGiftPopup(true);
                pulseAnimation();
              }}
            >
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Ionicons name="gift" size={24} color="#FF7F50" />
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsRecording(!isRecording)}
            >
              {/* <Ionicons
                name={isRecording ? "mic" : "mic-outline"}
                size={24}
                color={isRecording ? "#FF3B30" : "#FF7F50"}
              /> */}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Gift Popup */}
      <GiftCoinPopup
        visible={showGiftPopup}
        onClose={() => setShowGiftPopup(false)}
        receiverId={receiverID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  mediaButton: {
    padding: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF7F50",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  rightButtons: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  mediaOptionsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  mediaOption: {
    alignItems: "center",
    width: width / 4,
    paddingHorizontal: 8,
  },
  mediaOptionText: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
  },
});

export default ChatFooter;
