import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./Redux/authSlice";
import { useEffect } from "react";

export default function App() {
  const dispatch = useDispatch();
  _storeData = async () => {
    try {
      // await AsyncStorage.setItem(
      //   '@MySuperStore:key',
      //   'I like to save it.',
      // );
    } catch (error) {
      // Error saving data
    }
  };
  useEffect(() => {
    _retrieveAuth = async () => {
      try {
        const IsAuthenticated = await AsyncStorage.getItem("Authenticated");
        const User = await AsyncStorage.getItem("User");
        if (IsAuthenticated !== null && User !== null) {
          // dispatch(login({ name: User.name, email: User.email }));
          router.replace("./pages/home");
        } else {
          router.replace("./pages/login");
        }
        console.log("IsAuthenticated",IsAuthenticated);
        
      } catch (error) {
        console.log(error);
      }
    };
    _retrieveAuth();
  }, []);

  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>loading...</Text>
    </View>
  );
}
