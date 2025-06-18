import React, { useEffect, useState, useCallback } from "react";
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
import EntypoIcons from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { login, logout } from "../Redux/authSlice";

const screenWidth = Dimensions.get("window").width;

export default function HeaderForm({ showStatusBar, isTransparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({});
  const translateX = useState(new Animated.Value(-screenWidth))[0];
  const [notificationOpen, setNotificationOpen] = useState(false);
  const translateZ = useState(new Animated.Value(-screenWidth))[0];

  const toggleMenu = () => {
    Animated.timing(translateX, {
      toValue: menuOpen ? -screenWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuOpen(!menuOpen);
  };

  const toggleNotification = () => {
    Animated.timing(translateZ, {
      toValue: notificationOpen ? screenWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setNotificationOpen(!notificationOpen);
  };

  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      const User = await AsyncStorage.getItem("User");
      setUser(JSON.parse(User));
    };
    getUser();
  }, []);
  return (
    <>
      {/* Normal Header Bar */}
      <View
        style={
          isTransparent ? stylesHeader.headerTransparent : stylesHeader.header
        }
      >
        <View style={stylesHeader.leftSection}>
          {/* Profile Image (Click to open menu) */}
          <TouchableOpacity
            onPress={toggleMenu}
            style={stylesHeader.profileContainer}
          >
            {user.profilePic ? (
              <Image
                source={{ uri: `https://58f7-182-70-116-29.ngrok-free.app${user.profilePic}` }}
                style={stylesHeader.profileImageLarge}
              />
            ) : (
              <Image
                source={require("../../assets/images/profile.jpg")}
                style={stylesHeader.profileImageLarge}
              />
            )}
          </TouchableOpacity>

          {/* Coins and Add Button */}
          <View style={stylesHeader.coinContainer}>
            <Ionicons name="star" size={16} color="gold" />
            <Text style={stylesHeader.coinText}>0</Text>
            <TouchableOpacity
              style={stylesHeader.addButton}
              onPress={() => router.push("../pages/coinScreen")}
            >
              <Ionicons name="add" size={16} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Side: Notification Bell */}
        <TouchableOpacity
          style={stylesHeader.notificationIcon}
          onPress={toggleNotification}
        >
          <Ionicons name="notifications-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Sidebar Menu */}
      <Animated.View
        style={[stylesHeader.menu, { transform: [{ translateX }] }]}
      >
        {/* Back Icon to Close Sidebar */}
        <TouchableOpacity
          style={stylesHeader.backIcon}
          onPress={() => router.replace("../pages/home")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* Profile Section */}
        <View style={stylesHeader.profileSection}>
          <View style={stylesHeader.profileRowContainer}>
            {/* Profile Row */}
            <TouchableOpacity
              style={stylesHeader.profileRow}
              onPress={() => {
                toggleMenu();
                router.push("../pages/profile");
              }}
            >
              {user.profilePic ? (
                <Image
                  source={{
                    uri: `https://58f7-182-70-116-29.ngrok-free.app${user.profilePic}`,
                  }}
                  style={stylesHeader.profileImageLarge}
                />
              ) : (
                <Image
                  source={require("../../assets/images/profile.jpg")}
                  style={stylesHeader.profileImageLarge}
                />
              )}
              <View style={stylesHeader.profileInfoContainer}>
                <Text style={stylesHeader.profileName}>
                  {user.userFirstName + " "}
                </Text>
                {/* Stats Row Below Profile Name */}
                <View style={stylesHeader.statsRow}>
                  <Ionicons name="diamond-outline" size={16} color="gray" />
                  <Text style={stylesHeader.statsText}>0</Text>
                  <Ionicons name="people-outline" size={16} color="gray" />
                  <Text style={stylesHeader.statsText}>0</Text>
                  <Ionicons name="star-outline" size={16} color="gray" />
                  <Text style={stylesHeader.statsText}>0</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Broadcast Button (Shifted to Right) */}
            <TouchableOpacity style={stylesHeader.broadcastButton}>
              <Ionicons name="videocam" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Horizontal Line */}
        <View style={stylesHeader.divider} />

        {/* Menu Items */}
        <TouchableOpacity style={stylesHeader.menuItem}>
          <Ionicons name="phone-portrait-outline" size={24} color="#000" />
          <View>
            <Text style={stylesHeader.menuText}>Get Tango App</Text>
            <Text style={stylesHeader.subText}>
              Stay connected with your friends anywhere!
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={stylesHeader.menuItem}
          onPress={() => {
            toggleMenu();
            router.push("../pages/(sidebar)/agency");
          }}
        >
          <Ionicons name="briefcase-outline" size={24} color="#000" />
          <Text style={stylesHeader.menuText}>Agency Program</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={stylesHeader.menuItem}
          onPress={() => {
            toggleMenu();
            router.push("../pages/fanPage");
          }}
        >
          <Ionicons name="heart-outline" size={24} color="#000" />
          <Text style={stylesHeader.menuText}>My Fans</Text>
        </TouchableOpacity>

        <TouchableOpacity style={stylesHeader.menuItem}>
          <Ionicons name="card-outline" size={24} color="#000" />
          <Text style={stylesHeader.menuText}>Tango Cards Auction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={stylesHeader.menuItem}>
          <Ionicons name="game-controller-outline" size={24} color="#000" />
          <Text style={stylesHeader.menuText}>Social Games</Text>
        </TouchableOpacity>

        {/* Horizontal Line */}
        <View style={stylesHeader.divider} />

        {/* Logout Button */}
        <TouchableOpacity
          style={[stylesHeader.menuItem]}
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
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#000" />
          <Text style={stylesHeader.menuText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Overlay when menu is open */}
      {/* {notificationOpen && <TouchableOpacity style={stylesHeader.overlay} onPress={toggleNotification} />} */}

      {/* /// Notification Sidebar */}
      <Animated.View
        style={[
          stylesHeader.notificationBar,
          { transform: [{ translateX: translateZ }] },
        ]}
      >
        {/* Back Icon to Close Sidebar */}
        <TouchableOpacity
          style={stylesHeader.backIcon}
          onPress={toggleNotification}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={stylesHeader.notificationText}>Notifications</Text>
        {user.profilePic ? (
          <Image
            source={{ uri: `https://58f7-182-70-116-29.ngrok-free.app${user.profilePic}` }}
            style={stylesHeader.profileImageLarge}
          />
        ) : (
          <Image
            source={require("../../assets/images/profile.jpg")}
            style={stylesHeader.profileImageLarge}
          />
        )}
        <Text style={stylesHeader.followText}>+1 Followers</Text>
        <EntypoIcons
          name="chevron-right"
          size={24}
          style={stylesHeader.rightArrow}
        />
      </Animated.View>
    </>
  );
}

const stylesHeader = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f3f3f3",
  },
  headerTransparent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "black",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#999",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
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
    width: 50,
    height: 50,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  menu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%", // Full width
    height: "100%",
    backgroundColor: "#f3f3f3",
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
    color: "black",
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
    marginLeft: 10,
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
    backgroundColor: "#111",
    marginVertical: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuText: {
    color: "black",
    fontSize: 18,
    marginLeft: 10,
  },
  subText: {
    color: "gray",
    fontSize: 12,
    marginLeft: 10,
  },
  notificationText: {
    color: "#fff",
    fontSize: 26,
    marginLeft: 40,
    bottom: 20,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(207, 42, 42, 0.5)",
    zIndex: 1,
  },
  followText: {
    color: "#fff",
    fontSize: 30,
    paddingLeft: 70,
    bottom: 40,
  },
  rightArrow: {
    position: "absolute",
    right: 20, // Adjust the value as needed
    color: "grey",
    fontSize: 26,
    fontWeight: "bold",
    paddingTop: 0,
    marginTop: 20,
    top: 50,
  },
  notificationBar: {
    position: "absolute",
    width: "100%", // Full width
    height: "100%",
    backgroundColor: "#111",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 2,
  },
});
