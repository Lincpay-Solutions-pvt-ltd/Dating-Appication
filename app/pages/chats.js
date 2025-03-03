import React from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import ChatFooter from "../components/ChatFooter";
import { StatusBar } from "expo-status-bar";



export default Chats = () => {
  const gifts = [
    { id: "1", icon: "https://via.placeholder.com/50", price: 1099 },
    { id: "2", icon: "https://via.placeholder.com/50", price: 1499 },
    { id: "3", icon: "https://via.placeholder.com/50", price: 3 },
    { id: "4", icon: "https://via.placeholder.com/50", price: 8 },
    { id: "5", icon: "https://via.placeholder.com/50", price: 4 },
    { id: "6", icon: "https://via.placeholder.com/50", price: 5 },
    { id: "7", icon: "https://via.placeholder.com/50", price: 9 },
    { id: "8", icon: "https://via.placeholder.com/50", price: 11 },
  ];
  return (
    <>
    {/* <StatusBar style="" /> */}
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }} // Replace with actual profile image
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>RandomName</Text>
          <Text style={styles.status}>Active 2 hr. ago</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.callIcon}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Gift Section */}
      <View style={styles.giftSection}>
        <Text style={styles.giftPrompt}>Send gift to get noticed!</Text>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }} // Replace with heart gift image
          style={styles.giftImage}
        />
        <TouchableOpacity style={styles.sendGiftButton}>
          <Text style={styles.sendGiftText}>Send Gift 💰99</Text>
        </TouchableOpacity>
      </View>
      <ChatFooter />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    color: "#888",
    fontSize: 12,
  },
  callIcon: {
    color: "#fff",
    fontSize: 20,
  },
  giftSection: {
    alignItems: "center",
    marginVertical: 60,
  },
  giftPrompt: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  giftImage: {
    width: 100,
    height: 100,
  },
  sendGiftButton: {
    backgroundColor: "#222",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  sendGiftText: {
    color: "#fff",
    fontSize: 16,
    marginVertical:20
  },
  giftItem: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  giftIcon: {
    width: 40,
    height: 40,
  },
  giftPrice: {
    color: "#fff",
    fontSize: 12,
    marginVertical:20
  },
  messageInputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 30,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 10,
  },
  icon: {
    color: "#fff",
    fontSize: 20,
    marginHorizontal: 5,
  },
});
