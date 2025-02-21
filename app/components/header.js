import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HeaderForm() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.headerText}>Tango</Text>
      <Ionicons style={styles.icon} name="menu" size={24} color="black" />
      <Ionicons style={styles.icon} name="search" size={24} color="black" />
      <Ionicons name="notifications" size={24} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#ff0073",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center", // Ensures text is centered if it wraps
  },
});
