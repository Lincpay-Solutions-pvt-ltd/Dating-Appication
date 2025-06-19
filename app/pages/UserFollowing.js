import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useMemo } from "react";
import axios from "axios";

export default function UserFollowing() {
  const [user, setUser] = useState({});
  const [followerName, setFollowerName] = useState("");
  const [followingData, setFollowingData] = useState([]);

  useMemo(() => {
    const getUser = async () => {
      const User = await AsyncStorage.getItem("User");
      setUser(JSON.parse(User));
      fetchFollowingData(JSON.parse(User));
    };
    getUser();
  }, []);

  const fetchFollowingData = async (user) => {
    console.log("Fetching following data for user2:", user.userID);

    try {
      const response = await axios.get(
        `https://58f7-182-70-116-29.ngrok-free.app/api/v1/follow/getFollowingList/${user.userID}`
      );
      if (response.data.status === true) {
        setFollowingData(response.data.data);

        const followingList = response.data.data;
        followingList.forEach((user) => {
          const fullName = `${user.userFirstName} ${user.userSurname}`;
          setFollowerName(fullName);
        });
      } else {
        console.error("Failed to fetch following data");
      }
    } catch (error) {
      console.error("Error fetching following data:2", error.response.data);
    }
  };

  const OpenUserProfile = (item) => {
    // router.push("../pages/OtherProfile");
    router.push({
      pathname: "../pages/OtherProfile",
      params: { userData: JSON.stringify(item) },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Following</Text>
      <Text style={styles.subHeader}>
        Total Following : Total Following count
      </Text>
      <FlatList
        data={followingData}
        keyExtractor={(item) => item.userID}
        renderItem={({ item }) => {
          console.log("Item ", item);

          return (
            <TouchableOpacity onPress={() => OpenUserProfile(item)}>
              <View style={styles.userRow}>
                {item.profilePic ? (
                  <Image
                    source={{
                      uri: `https://58f7-182-70-116-29.ngrok-free.app${item.profilePic}`,
                    }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder} />
                )}
                <View style={styles.userInfo}>
                  <Text style={styles.username}>
                    {item.userFirstName + " " + item.userSurname}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },
  search: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: "white",
  },
  list: {
    paddingBottom: 100,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
    backgroundColor: "#333",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  name: {
    color: "#aaa",
    fontSize: 13,
  },
  followButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  followText: {
    color: "white",
    fontWeight: "600",
  },
});
