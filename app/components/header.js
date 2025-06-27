import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import EntypoIcons from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "../Redux/authSlice";

const screenWidth = Dimensions.get("window").width;

export default function HeaderForm({ isTransparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [user, setUser] = useState({});
  const [userCoins, setUserCoins] = useState(0);
  const translateX = useState(new Animated.Value(-screenWidth))[0];
  const translateZ = useState(new Animated.Value(screenWidth))[0];
  const router = useRouter();
  const dispatch = useDispatch();

  // Helper to determine if a route is active
  const isActive = (route) => pathname === route;

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

  const fetchUserCoins = async (userID) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/coins/user-total-coin/${userID}`
      );
      if (response.data?.status) {
        const coins = response.data.data || [];
        const totalCount =
          coins.length > 0 ? coins[coins.length - 1].totalCount : 0;
        setUserCoins(totalCount);
      }
    } catch (error) {
      console.error("Error fetching user coins:", error.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("User");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          if (parsedUser?.userID) {
            fetchUserCoins(parsedUser.userID);
          }
        }
      } catch (e) {
        console.error("Error loading user from AsyncStorage:", e);
      }
    };
    getUser();
  }, []);

  return (
    <>
      {/* Header */}
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
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${user.profilePic}`,
                }}
                style={stylesHeader.profileImageLarge}
              />
            ) : (
              <Image
                source={require("../../assets/images/profile.jpg")}
                style={stylesHeader.profileImageLarge}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesHeader.addButton}
            onPress={() => router.push("./coinScreen")}
          >
            <View style={stylesHeader.coinContainer}>
              <Ionicons name="star" size={16} color="gold" />
              <Text style={stylesHeader.coinText}>{userCoins}</Text>
              <Ionicons
                style={stylesHeader.plusIcon}
                name="add"
                size={16}
                color="black"
              />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={stylesHeader.notificationIcon}
          onPress={()=>router.push("../pages/chatList")}
        >
          <MaterialIcons
            name="chat-bubble-outline"
            size={24}
            style={{ transform: [{ scaleX: -1 }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Sidebar Menu */}
      <Animated.View
        style={[stylesHeader.menu, { transform: [{ translateX }] }]}
      >
        <TouchableOpacity
          style={stylesHeader.backIcon}
          onPress={() => router.replace("../pages/home")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={stylesHeader.profileSection}>
          <View style={stylesHeader.profileRowContainer}>
            <TouchableOpacity
              style={stylesHeader.profileRow}
              onPress={() => {
                toggleMenu();
                router.replace("../pages/home");
              }}
            >
              {user.profilePic ? (
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${user.profilePic}`,
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

            <TouchableOpacity style={stylesHeader.broadcastButton}>
              <Ionicons name="videocam" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={stylesHeader.divider} />

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
            router.push("../pages/agency");
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

        <View style={stylesHeader.divider} />

        <TouchableOpacity
          style={stylesHeader.menuItem}
          onPress={async () => {
            Animated.timing(translateX, {
              toValue: -screenWidth,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setMenuOpen(false);
              AsyncStorage.removeItem("Authenticated");
              AsyncStorage.removeItem("User");
              dispatch(logout());
              router.navigate("../pages/login");
            });
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#000" />
          <Text style={stylesHeader.menuText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Notification Panel */}
      <Animated.View
        style={[
          stylesHeader.notificationBar,
          { transform: [{ translateX: translateZ }] },
        ]}
      >
        <TouchableOpacity
          style={stylesHeader.backIcon}
          onPress={toggleNotification}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={stylesHeader.notificationText}>Notifications</Text>
        {user.profilePic ? (
          <Image
            source={{
              uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${user.profilePic}`,
            }}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    elevation: 4, // Shadow on Android
    shadowColor: "#000", // Shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    width: "100%",
    height: "100%",
    backgroundColor: "#111",
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  plusIcon: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 50,
    marginLeft: 5,
    color: "black",
  },
});
