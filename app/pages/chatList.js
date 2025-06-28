import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../components/header";
import Footer from "../components/footer";
import { useRouter, usePathname, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

export default ChatList = () => {
  const [user, setUser] = useState({});
  const { userID } = useLocalSearchParams();
  const [followingData, setFollowingData] = useState([]);
  const [totalFollowings, setTotalFollowings] = useState(0);
  const [followerName, setFollowerName] = useState("");
  const router = useRouter();
  const { id, name, profilePic, gender, isMessage } = useLocalSearchParams();
  const [message, setMessage] = useState(false);

  useMemo(() => {
    const getUser = async () => {
      const User = await AsyncStorage.getItem("User");
      setUser(JSON.parse(User));
      //fetchFollowingData(JSON.parse(User));
    };
    getUser();
    setMessage(isMessage);
  }, []);

  const fetchFollowingData = async (user) => {
    console.log("Fetching chat following data :", user.userID);

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

  return (
    <>
      <Header />
      <View style={styles.container}>
        {message ? (
          <>
            {/* Banner */}
            <View style={styles.banner}>
              <Text style={styles.bannerText}>Special First-Time Offer!</Text>
              <Text style={styles.bannerSubText}>150% More</Text>
            </View>

            {/* Chat List */}
            <FlatList
              data={followingData}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "../pages/chats",
                      params: {
                        id: item.id,
                        name: `${item.userFirstName} ${item.userSurname}`,
                        profilePic: item.profilePic,
                        gender: item.userGender,
                      },
                    });
                  }}
                >
                  <View style={styles.messageItem}>
                    <Image
                      source={
                        item.profilePic
                          ? {
                              uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.profilePic}`,
                            }
                          : item.userGender == 2
                          ? require("../../assets/images/profile-female.jpg")
                          : require("../../assets/images/profile.jpg")
                      }
                      style={styles.avatar}
                    />
                    <View style={styles.messageContent}>
                      <Text style={styles.messageName}>
                        {item.userFirstName} {item.userSurname}
                      </Text>
                      {/* Optionally show last message */}
                      {/* <Text style={styles.messageText}>{item.message}</Text> */}
                    </View>
                    <Text style={styles.messageTime}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        ) : (
          // Optionally show a fallback if no message
          <View style={styles.noMessagesTextContainer}>
            <Text style={styles.noMessagesText}>No messages to display.</Text>
          </View>
        )}
      </View>

      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    padding: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  coinText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  banner: {
    backgroundColor: "#FF7F50", // Coral
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 12,
    shadowColor: "#FF7F50",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  bannerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  bannerSubText: {
    fontSize: 14,
    color: "#fdfdfd",
    opacity: 0.9,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  messageAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#eee",
  },
  messageContent: {
    flex: 1,
    marginLeft: 16,
  },
  messageName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#222",
  },
  messageText: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  noMessagesTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMessagesText: {
    fontWeight: "600",
    fontSize: 20,
    color: "#000",
    textAlign: "center",
  },
});
