import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname, Link,useFocusEffect } from "expo-router";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import IoniconsIcons from "react-native-vector-icons/Ionicons";
import OcticonsIcons from "react-native-vector-icons/Octicons";
import EntypoIcons from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect,useMemo } from "react";

import { useCallback,useState } from "react";
export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  

  useEffect(() => {
    const pageName = pathname.split('/').pop();
    
  }, [pathname]);
  

  return (
    <View style={styles.container}>
     <TouchableOpacity
        onPress={() => {
          router.replace('../pages/home');
        }}
      >
        <MaterialCommunityIcons style={styles.FooterIcons} name={pathname === "/pages/home" ? "thumb-up" : "thumb-up-outline"} size={28} color="#fff" />
        <Text style={ styles.footerText }>Home</Text>
        
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        router.push("../pages/Following");
        }}
        >
        <MaterialIcon style={styles.FooterIcons} name={pathname === "/pages/Following" ? "person" : "person-outline"} size={28} color="#fff" />
        <Text style={ styles.footerText }>Following</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        router.push("../pages/explore");
        }}
        >
        <IoniconsIcons style={styles.FooterIcons} name={pathname === "/pages/explore" ? "search" : "search-outline"} size={28} color="#fff" />
        <Text style={ styles.footerText }>Explore</Text>
      </TouchableOpacity>
      {pathname === "/pages/reels" ?
        (<EntypoIcons style={styles.FooterIcons} name="folder-video" size={28} color="#fff" />) :
        (<TouchableOpacity onPress={() => {
          router.push({ pathname: "../pages/reels" });
          }}
          >
          <OcticonsIcons style={styles.FooterIcons} name="video" size={28} color="#fff" />
          <Text style={ styles.footerText }>Moments</Text>
        </TouchableOpacity>)
      }

      <TouchableOpacity onPress={() => {
        router.push("../pages/chatList");
        }}>
        <MaterialCommunityIcons style={styles.FooterIcons} name={pathname === "/pages/chatList" ? "chat" : "chat-outline"} size={28} color="#fff" />
        <Text style={ styles.footerText }>Chats</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0, 
    width: "100%", 
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#000000A0",
  },
  footerText:{
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    top: 2,
  },
});