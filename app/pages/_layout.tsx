import { Stack } from 'expo-router/stack';
import { Provider } from "react-redux";
import store from "../Redux/store";
import { BackHandler, Alert } from "react-native";
import React, { useEffect, useState, useCallback} from "react";
import { usePathname } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function Layout() {
  const pathName = usePathname();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        const currentPath = pathName; 

        if (currentPath === "/pages/home") {
          Alert.alert(
            "Hold on!",
            "Are you sure you want to exit the app?",
            [
              { text: "Cancel", style: "cancel", onPress: () => {} },
              { text: "YES", onPress: () => BackHandler.exitApp() }
            ]
          );
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [pathName]) // depend on pathName so it's fresh
  );

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}

