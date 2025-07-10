import { Stack } from 'expo-router/stack';
import { Provider } from "react-redux";
import store from "../Redux/store";
import { BackHandler, Alert } from "react-native";
import React, { useEffect } from "react";
import {  usePathname } from 'expo-router';
import { ToastProvider } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SocketProvider } from '../services/SocketContext';
import CallManager from '../components/CallManager';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const pathName = usePathname();
  const [user, setUser] = React.useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (pathName === "/pages/home") {
          Alert.alert(
            "Hold on!",
            "Are you sure you want to exit the app?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "YES", onPress: () => BackHandler.exitApp() }
            ]
          );
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [pathName])
  );

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("User");
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.log("Error loading user:", error);
      }
    };
    getUser();
  }, []);





  return (
    <SafeAreaProvider>
      <SocketProvider>
        <CallManager currentUser={user} />
        <ToastProvider
          placement="bottom"
          duration={3000}
          animationType="slide-in"
          successColor="#4BB543"
          dangerColor="#FF3B30"
          warningColor="#FFA500"
          textStyle={{ fontSize: 16 }}
        >
          <Provider store={store}>
            <Stack screenOptions={{ headerShown: false }} />
          </Provider>
        </ToastProvider>
      </SocketProvider>
    </SafeAreaProvider>
  );
}
