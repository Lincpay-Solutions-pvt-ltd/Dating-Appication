import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, logout } from "../Redux/authSlice";
import VideoCards from "../components/videoCards";
import Footer from "../components/footer";
import Header from "../components/header";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
    <Header />
      <Button
        title="Logout"
        onPress={async () => {
          await AsyncStorage.removeItem("Authenticated");
          await AsyncStorage.removeItem("User");
          dispatch(logout());

          router.navigate("./login");
        }}
      />

      <VideoCards />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
});
