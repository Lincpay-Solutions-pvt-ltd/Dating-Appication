import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Button } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Footer() {
  const router = useRouter();
    return (
        <View style={styles.container}>
          <MaterialIcon name="thumb-up" size={24} color="#fff" />
          <TouchableOpacity onPress={() => router.push("../pages/Following")}>
            <MaterialIcon name="people" size={24} color="#fff" />
          </TouchableOpacity>
          <MaterialIcon name="search" size={24} color="#fff" />
          <MaterialIcon name="stars" size={24} color="#fff" />
          <TouchableOpacity onPress={() => router.push("../pages/about")}>
            <MaterialCommunityIcons name="chat-processing-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      position: "fixed",
      top   : 7, // Fixes the position at the bottom
      width: "100%", // Ensures full width
      flexDirection: "row",
      justifyContent: "space-around", // Evenly spaces icons
      alignItems: "center", // Centers icons vertically
      paddingVertical: 20,
      backgroundColor: "#ff0073",
    },
  });