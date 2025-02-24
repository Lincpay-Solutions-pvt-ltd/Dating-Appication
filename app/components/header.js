import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../Redux/authSlice";

const screenWidth = Dimensions.get("window").width;

export default function HeaderForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const translateX = useState(new Animated.Value(-screenWidth))[0];

  const toggleMenu = () => {
    Animated.timing(translateX, {
      toValue: menuOpen ? -screenWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuOpen(!menuOpen);
  };
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <>
      {/* Normal Header Bar */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {/* Profile Image (Click to open menu) */}
          <TouchableOpacity onPress={toggleMenu} style={styles.profileContainer}>
            <Image
              source={require("../../assets/images/profile.jpg")}
              style={styles.profileImage}
            />
          </TouchableOpacity>

          {/* Coins and Add Button */}
          <View style={styles.coinContainer}>
            <Ionicons name="star" size={16} color="gold" />
            <Text style={styles.coinText}>0</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={16} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Side: Notification Bell */}
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      

      {/* Sidebar Menu */}
      <Animated.View style={[styles.menu, { transform: [{ translateX }] }]}>
        {/* Back Icon to Close Sidebar */}
        <TouchableOpacity style={styles.backIcon} onPress={toggleMenu}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileRowContainer}>
            {/* Profile Row */}
            <TouchableOpacity style={styles.profileRow} onPress={() => console.log("Open Profile Page")}>
              <Image
                source={require("../../assets/images/profile.jpg")}
                style={styles.profileImageLarge}
              />
              <View style={styles.profileInfoContainer}>
                <Text style={styles.profileName}>Dancing Giraffe</Text>
                {/* Stats Row Below Profile Name */}
                <View style={styles.statsRow}>
                  <Ionicons name="diamond-outline" size={16} color="gray" />
                  <Text style={styles.statsText}>0</Text>
                  <Ionicons name="people-outline" size={16} color="gray" />
                  <Text style={styles.statsText}>0</Text>
                  <Ionicons name="star-outline" size={16} color="gray" />
                  <Text style={styles.statsText}>0</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Broadcast Button (Shifted to Right) */}
            <TouchableOpacity style={styles.broadcastButton}>
              <Ionicons name="videocam" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>


        {/* Horizontal Line */}
        <View style={styles.divider} />

        {/* Menu Items */}
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="phone-portrait-outline" size={24} color="white" />
          <View>
            <Text style={styles.menuText}>Get Tango App</Text>
            <Text style={styles.subText}>Stay connected with your friends anywhere!</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="briefcase-outline" size={24} color="white" />
          <Text style={styles.menuText}>Agency Program</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="heart-outline" size={24} color="white" />
          <Text style={styles.menuText}>My Fans</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="card-outline" size={24} color="white" />
          <Text style={styles.menuText}>Tango Cards Auction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="game-controller-outline" size={24} color="white" />
          <Text style={styles.menuText}>Social Games</Text>
        </TouchableOpacity>

        {/* Horizontal Line */}
        <View style={styles.divider} />

        {/* Logout Button */}
        <TouchableOpacity 
            style={[styles.menuItem]} 
            onPress={async () => {
              // Close the sidebar first
              Animated.timing(translateX, {
                toValue: -screenWidth,
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                // After animation completes, perform logout
                setMenuOpen(false); // Ensure menu state is updated

                // Clear AsyncStorage
                AsyncStorage.removeItem("Authenticated");
                AsyncStorage.removeItem("User");

                // Dispatch logout action
                dispatch(logout());

                // Navigate to login page
                router.navigate("../pages/login");
              });
            }}>
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>

      </Animated.View>

      {/* Overlay when menu is open */}
      {menuOpen && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#000",
  },
    leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10
  },
  coinText: {
    color: "white",
    marginLeft: 5,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 5,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 5,
  },
  notificationIcon: {
    padding: 5,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  menu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%", // Full width
    height: "100%",
    backgroundColor: "#111",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  profileSection: {
    alignItems: "center",
    paddingBottom: 20,
  },
  profileRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes broadcastButton to the right
    width: "100%", 
  },  
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profileImageLarge: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  profileInfoContainer: {
    marginLeft: 10, // Add spacing between image and text
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 10
  },
  statsText: {
    color: "gray",
    marginLeft: 5,
    fontSize: 14,
    marginRight: 10,
  },
  broadcastButton: {
    padding: 15,
    backgroundColor: "#e91e63",
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  subText: {
    color: "gray",
    fontSize: 12,
    marginLeft: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
});
