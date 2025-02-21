import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Button } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Footer() {
    return (
        <View style={styles.container}>
      <Icon name="home" size={24} color="#fff" />
      <Icon name="search" size={24} color="#fff" />
      <Icon name="notifications" size={24} color="#fff" />
      <Icon name="person" size={24} color="#fff" />
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