import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "./Redux/authSlice";
export default function App() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const _retrieveAuth = async () => {
      try {
        const IsAuthenticated = await AsyncStorage.getItem("Authenticated");
        const User = await AsyncStorage.getItem("User");

        if (IsAuthenticated !== null && User !== null) {
          dispatch(login(JSON.parse(User))); // Enable this if you're using Redux state
          router.replace("./pages/home");
        } else {
          router.replace("./pages/login");
        }
      } catch (error) {
        console.log("Auth check failed:", error);
      }
    };

    // initializeDatabase();
    _retrieveAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Loading...</Text>
    </View>
  );
}
