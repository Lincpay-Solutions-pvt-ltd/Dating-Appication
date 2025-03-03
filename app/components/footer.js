import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname, Link } from "expo-router";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Button } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import IoniconsIcons from "react-native-vector-icons/Ionicons";
import OcticonsIcons from "react-native-vector-icons/Octicons";
import EntypoIcons from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Footer() {
  const router = useRouter();
  const currentRoute = usePathname();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("../pages/home")}>
        <MaterialCommunityIcons name={currentRoute === "/pages/home" ? "thumb-up" : "thumb-up-outline"} size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("../pages/Following")}>
        <MaterialIcon name={currentRoute === "/pages/Following" ? "person" : "person-outline"} size={28} color="#fff" />
      </TouchableOpacity>
      <IoniconsIcons name={currentRoute === "/pages/search" ? "search" : "search-outline"} size={28} color="#fff" />

      {currentRoute === "/pages/moments" ?
        (<EntypoIcons name="folder-video" size={28} color="#fff" />) :
        (<TouchableOpacity onPress={() => router.push("../pages/moments")}>
        <OcticonsIcons name="video" size={28} color="#fff" />
        </TouchableOpacity>)
      }
      <MaterialIcon name={currentRoute === "/pages/notifications" ? "notifications" : "notifications-none"} size={28} color="#fff" />

      <TouchableOpacity onPress={() => router.push("../pages/chatList")}>
        <MaterialCommunityIcons name={currentRoute === "/pages/chatList" ? "chat" : "chat-outline"} size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0, // Fixes the position at the bottom
    width: "100%", // Ensures full width
    flexDirection: "row",
    justifyContent: "space-around", // Evenly spaces icons
    alignItems: "center", // Centers icons vertically
    paddingVertical: 20,
    backgroundColor: "#000000A0",
  },
});