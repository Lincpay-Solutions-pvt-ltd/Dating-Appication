import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  PermissionsAndroid,
  Platform,
  Alert,
  KeyboardAvoidingView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

// API key for Giphy (in a real app, you'd store this in an environment variable)
const GIPHY_API_KEY =
  "https://api.giphy.com/v1/gifs/trending?api_key=&limit=25&offset=0&rating=g&bundle=messaging_non_clips"; // Replace with your actual Giphy API key

const ChatFooter = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [giphyModalVisible, setGiphyModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [giphyResults, setGiphyResults] = useState([]);
  const [giphySearchTerm, setGiphySearchTerm] = useState("");
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const router = useRouter();

  const emojiData = [
    { id: "1", icon: "🧑‍🎤", coins: 1099 },
    { id: "2", icon: "🦄", coins: 1499 },
    { id: "3", icon: "⭐", coins: 3 },
    { id: "4", icon: "💖", coins: 8 },
    { id: "5", icon: "🐱", coins: 4 },
    { id: "6", icon: "🍎", coins: 5 },
    { id: "7", icon: "🐯", coins: 9 },
    { id: "8", icon: "🎯", coins: 11 },
    { id: "9", icon: "🧑‍🎤", coins: 1099 },
    { id: "10", icon: "🦄", coins: 1499 },
    { id: "11", icon: "⭐", coins: 3 },
    { id: "12", icon: "💖", coins: 8 },
  ];

  const giftsData = [
    // Classic category
    { id: "1", icon: "⭐", coins: 3, category: "Classic" },
    { id: "2", icon: "⭐", coins: 5, category: "Classic" },
    { id: "3", icon: "🌻", coins: 7, category: "Classic" },
    { id: "4", icon: "🐯", coins: 9, category: "Classic" },
    { id: "5", icon: "🌈", coins: 5, category: "Classic" },
    { id: "6", icon: "🎯", coins: 11, category: "Classic" },
    { id: "7", icon: "💝", coins: 19, category: "Classic" },
    { id: "8", icon: "🎡", coins: 29, category: "Classic" },
    { id: "9", icon: "😎", coins: 5, category: "Classic" },
    { id: "10", icon: "👏", coins: 39, category: "Classic" },
    { id: "11", icon: "🌻", coins: 59, category: "Classic" },
    { id: "12", icon: "📹", coins: 79, category: "Classic" },
    { id: "13", icon: "🐱", coins: 49, category: "Classic" },
    { id: "14", icon: "🐻", coins: 89, category: "Classic" },
    { id: "15", icon: "🍻", coins: 129, category: "Classic" },
    { id: "16", icon: "🐰", coins: 229, category: "Classic" },
  ];

  // Sample trending GIFs (would normally come from the Giphy API)
  const trendingGifs = [
    { id: "1", source: require("../../assets/gif/rocket.json") },
  ];

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    // Load trending GIFs initially
    setGiphyResults(trendingGifs);

    // Cleanup listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const searchGiphy = async (term) => {
    if (!term.trim()) {
      setGiphyResults(trendingGifs);
      return;
    }

    setIsLoadingGifs(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=https://api.giphy.com/v1/gifs/random?api_key=&tag=&rating=g&q=${encodeURIComponent(
          term
        )}&limit=20`
      );
      const data = await response.json();
      const formattedResults = data.data.map((gif) => ({
        id: gif.id,
        url: gif.images.fixed_height.url,
      }));

      // For demo purposes, we'll just filter the trending gifs by term
      setTimeout(() => {
        const filtered = trendingGifs.filter(
          (gif) => Math.random() > 0.3 // Just to simulate some gifs matching and some not
        );
        setGiphyResults(filtered.length > 0 ? filtered : trendingGifs);
        setIsLoadingGifs(false);
      }, 1000);
    } catch (error) {
      
      setGiphyResults(trendingGifs);
      setIsLoadingGifs(false);
    }
  };

  const openCamera = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs access to your camera",
          buttonPositive: "OK",
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          "Permission Denied",
          "You need to grant camera permission to use this feature."
        );
        return;
      }
    }

    launchCamera(
      {
        mediaType: "photo",
        quality: 1,
        maxWidth: 480,
        maxHeight: 480,
      },
      (response) => {
        // if (response.didCancel) {
        //   console.log("User cancelled camera");
        // } else if (response.errorMessage) {
        //   console.error("Camera Error: ", response.errorMessage);
        // } else {
        //   console.log("Photo captured: ", response.assets);
        // }
      }
    );
  };

  const openGallery = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs access to your storage",
          buttonPositive: "OK",
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          "Permission Denied",
          "You need to grant storage permission to use this feature."
        );
        return;
      }
    }

    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        maxWidth: 480,
        maxHeight: 480,
      },
      (response) => {
        // if (response.didCancel) {
        //   console.log("User cancelled gallery");
        // } else if (response.errorMessage) {
        //   console.error("Gallery Error: ", response.errorMessage);
        // } else {
        //   console.log("Photo selected: ", response.assets);
        // }
      }
    );
  };

  const renderGiftItem = ({ item }) => (
    <TouchableOpacity style={styles.giftItem}>
      <View style={styles.giftIconContainer}>
        <Text style={styles.giftIcon}>{item.icon}</Text>
      </View>
      <View style={styles.giftCoinContainer}>
        <Text style={styles.coinIcon}>🪙</Text>
        <Text style={styles.giftCoins}>{item.coins}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: messages.length.toString(), text: message },
      ]);
      setMessage("");
    }
  };

  const handleSelectGif = (gifUrl) => {
    // In a real app, you would send the GIF as a message
    setMessages([
      ...messages,
      { id: messages.length.toString(), type: "gif", url: gifUrl },
    ]);
    setGiphyModalVisible(false);
  };

  // Determine if we should show the action buttons or send button
  const hasText = message.trim().length > 0;

  const renderMessageItem = ({ item }) => {
    if (item.type === "gif") {
      return (
        <View style={styles.messageContainer}>
          <Image source={{ uri: item.url }} style={styles.gifMessage} />
        </View>
      );
    } else {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Message List */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.messageList}
          />

          {/* Emoji Scroll - Hidden when keyboard is visible */}
          {!isKeyboardVisible && (
            <FlatList
              horizontal
              data={emojiData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.emojiContainer}>
                  <Text style={styles.emojiText}>{item.icon}</Text>
                  <Text style={styles.emojiCoins}>{item.coins}</Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}

          {/* Chat Input Row */}
          <View
            style={[
              styles.inputBar,
              isKeyboardVisible && styles.inputBarKeyboardVisible,
            ]}
          >
            <TouchableOpacity style={styles.iconButton} onPress={openGallery}>
              <Ionicons name="image-outline" size={24} color="#888" />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Message..."
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
            />

            {!hasText ? (
              <>
                {/* Show these buttons only when there's no text */}
                <TouchableOpacity
                  style={styles.gifButton}
                  onPress={() => setGiphyModalVisible(true)}
                >
                  <Text style={styles.gifText}>GIF</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={openCamera}
                >
                  <Ionicons name="camera-outline" size={24} color="#888" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setIsRecording((prev) => !prev)}
                >
                  <Ionicons
                    name={isRecording ? "mic" : "mic-outline"}
                    size={24}
                    color={isRecording ? "red" : "#888"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setGiftModalVisible(true)}
                >
                  <Ionicons name="gift-outline" size={24} color="#888" />
                </TouchableOpacity>
              </>
            ) : (
              // Show send button when there's text
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* Gift Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={giftModalVisible}
            onRequestClose={() => setGiftModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <SafeAreaView style={styles.giftModalContainer}>
                {/* Modal Header */}
                <View style={styles.giftModalHeader}>
                  <Text style={styles.giftModalTitle}>Classic</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setGiftModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* User Coin Balance */}
                <View style={styles.coinBalanceContainer}>
                  <Text style={styles.coinIcon}>🪙</Text>
                  <Text style={styles.coinBalance}>0</Text>
                  <TouchableOpacity style={styles.addCoinsButton}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Gifts Grid */}
                <FlatList
                  data={giftsData}
                  keyExtractor={(item) => item.id}
                  renderItem={renderGiftItem}
                  numColumns={4}
                  contentContainerStyle={styles.giftsGrid}
                />

                {/* Gift Shop Button */}
                <View style={styles.giftShopButtonContainer}>
                  <TouchableOpacity style={styles.giftShopButton}>
                    <Ionicons name="gift" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </View>
          </Modal>

          {/* Giphy Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={giphyModalVisible}
            onRequestClose={() => setGiphyModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <SafeAreaView style={styles.giphyModalContainer}>
                {/* Giphy Modal Header */}
                <View style={styles.giphyModalHeader}>
                  <Text style={styles.giphyModalTitle}>GIF</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setGiphyModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.giphySearchContainer}>
                  <Ionicons
                    name="search"
                    size={20}
                    color="#888"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.giphySearchInput}
                    placeholder="Search GIPHY"
                    placeholderTextColor="#888"
                    value={giphySearchTerm}
                    onChangeText={(text) => {
                      setGiphySearchTerm(text);
                      searchGiphy(text);
                    }}
                  />
                </View>

                {/* GIFs Grid */}
                {isLoadingGifs ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0084ff" />
                  </View>
                ) : (
                  <FlatList
                    data={giphyResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.gifItemContainer}
                        onPress={() => handleSelectGif(item.url)}
                      >
                        <Image
                          source={{ uri: item.url }}
                          style={styles.gifThumbnail}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )}
                    numColumns={2}
                    contentContainerStyle={styles.giphyGrid}
                  />
                )}

                {/* Powered by GIPHY */}
                <View style={styles.poweredByContainer}>
                  <Text style={styles.poweredByText}>Powered by GIPHY</Text>
                </View>
              </SafeAreaView>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    width: "100%",
    paddingBottom: Platform.OS === "ios" ? 20 : 7,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: "flex-start",
    padding: 10,
  },
  messageContainer: {
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "flex-end", // Aligns the whole container to the right
    maxWidth: "70%", // Optional: adjust width as needed
  },
  messageText: {
    color: "#000",
    fontSize: 16,
  },
  gifMessage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  emojiContainer: {
    alignItems: "center",
    marginHorizontal: 6,
  },
  emojiText: {
    fontSize: 24,
  },
  emojiCoins: {
    color: "gold",
    fontSize: 12,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f3f3",
    backgroundColor: "#000",
  },
  inputBarKeyboardVisible: {
    paddingBottom: Platform.OS === "ios" ? 20 : 5, // Extra padding for iPhone notch
  },
  iconButton: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "white",
    marginHorizontal: 6,
  },
  gifButton: {
    backgroundColor: "#222",
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
  },
  gifText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: "#f3f3f3", // Facebook Messenger blue color
    borderRadius: 20,
    padding: 10,
    marginLeft: 6,
  },
  // Modal Styles - Gift
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  giftModalContainer: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  giftModalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    position: "relative",
  },
  giftModalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    right: 15,
  },
  coinBalanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  coinIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  coinBalance: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addCoinsButton: {
    marginLeft: 8,
    backgroundColor: "#444",
    borderRadius: 20,
    padding: 4,
  },
  giftsGrid: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  giftItem: {
    width: "25%",
    padding: 8,
    alignItems: "center",
  },
  giftIconContainer: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 14,
    marginBottom: 5,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  giftIcon: {
    fontSize: 24,
  },
  giftCoinContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  giftCoins: {
    color: "white",
    fontWeight: "bold",
  },
  giftShopButtonContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  giftShopButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 30,
  },
  // Giphy Modal Styles
  giphyModalContainer: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  giphyModalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    position: "relative",
  },
  giphyModalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  giphySearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  giphySearchInput: {
    flex: 1,
    color: "white",
    paddingVertical: 10,
  },
  giphyGrid: {
    padding: 5,
  },
  gifItemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: "hidden",
    height: 120,
  },
  gifThumbnail: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  poweredByContainer: {
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  poweredByText: {
    color: "#888",
    fontSize: 12,
  },
});

export default ChatFooter;
