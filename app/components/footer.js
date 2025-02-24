import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Button } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Footer() {
  const router = useRouter();
    return (
        <View style={styles.container}>
      <Icon name="home" size={24} color="#fff" />
      <Icon name="search" size={24} color="#fff" />
      <Icon name="notifications" size={24} color="#fff" />
      <TouchableOpacity onPress={() => router.push("../pages/profile")}>
       <Icon name="person" size={24} color="#fff" />
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