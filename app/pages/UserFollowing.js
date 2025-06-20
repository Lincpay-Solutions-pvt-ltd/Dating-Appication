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
import IoniconsIcons from "react-native-vector-icons/Ionicons";
import { useState, useMemo } from "react";
import axios from "axios";

export default function UserFollowing() {
  const { userID } = useLocalSearchParams();
  const [user, setUser] = useState({});
  const [followerName, setFollowerName] = useState("");
  const [followingData, setFollowingData] = useState([]);
  const [totalFollowings, setTotalFollowings] = useState(0);

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
        `${
          process.env.EXPO_PUBLIC_API_BASE_URL
        }/api/v1/follow/getFollowingList/${userID ? userID : user.userID}`
      );
      if (response.data.status === true) {
        setFollowingData(response.data.data);
        const followingList = response.data.data;
        if (
          followingList.length &&
          followingList[followingList.length - 1].totalCount
        ) {
          setTotalFollowings(
            followingList[followingList.length - 1].totalCount
          );
        }
        followingList.forEach((user) => {
          const fullName = `${user.userFirstName} ${user.userSurname}`;
          setFollowerName(fullName);
        });
      }
    } catch (error) {
      console.log("Error fetching following data:2", error.response.data);
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
      <TouchableOpacity
        onPress={() => router.back()}
      >
        <IoniconsIcons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>Following</Text>
      <Text style={styles.subHeader}>Total Following : {totalFollowings}</Text>
      {followingData.length ? (
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
                        uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.profilePic}`,
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
      ) : (
        <Text style={styles.header}>No Followings</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7", // light gray background
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  backIcon: {
    position: "absolute",
    left: 20,
    top: 50,
    zIndex: 10,
  },

  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 4,
  },

  subHeader: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
  },

  noFollowings: {
    fontSize: 16,
    textAlign: "center",
    color: "#9ca3af",
    fontStyle: "italic",
    marginTop: 30,
  },

  search: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 15,
    color: "#111",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  list: {
    paddingBottom: 120,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
    borderWidth: 2,
    borderColor: "#2563eb",
  },

  userInfo: {
    flex: 1,
  },

  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  name: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 2,
  },

  followButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 10,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  followText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});


