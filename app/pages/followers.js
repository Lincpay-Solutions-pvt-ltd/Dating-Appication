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

export default function followers() {
  const { userID } = useLocalSearchParams();
  const [user, setUser] = useState({});
  const [followerName, setFollowerName] = useState("");
  const [followersData, setFollowersData] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [totalFollowers, setTotalFollowers] = useState(0);

  useMemo(() => {
    const getUser = async () => {
      const User = await AsyncStorage.getItem("User");
      setUser(JSON.parse(User));
      fetchFollowersData(JSON.parse(User));
    };
    getUser();
  }, []);

  const fetchFollowersData = async (user) => {
    let data = JSON.stringify({
      userID: user.userID,
    });
    try {
      const response = await axios.get(
        `${
          process.env.EXPO_PUBLIC_API_BASE_URL
        }/api/v1/follow/getFollowersList/${userID ? userID : user.userID}`
      );
      if (response.data.status === true) {
        // setUserData(response.data.data);
        setFollowersData(response.data.data);
        setSelectedImage(response.data.data[0].profilePic);

        const followerList = response.data.data;
        if (
          followerList.length &&
          followerList[followerList.length - 1].totalCount
        ) {
          setTotalFollowers(followerList[followerList.length - 1].totalCount);
        }
        followerList.forEach((user) => {
          const fullName = `${user.userFirstName} ${user.userSurname}`;
          setFollowerName(fullName);
        });
      }
    } catch (error) {
      console.error("Error fetching followers data:", error);
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
      <TouchableOpacity onPress={() => router.back()}>
        <IoniconsIcons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>Followers</Text>
      <Text style={styles.subHeader}>Total Followers : {totalFollowers}</Text>
      {followersData.length ? (
        <FlatList
          data={followersData}
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
        <Text style={styles.header}>No Followers</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 20,
    color: "#000",
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
    color: "black",
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
