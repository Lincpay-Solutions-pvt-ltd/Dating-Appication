import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "../components/header";
import Footer from "../components/footer";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ChatList = () => {
  const [user, setUser] = useState({});
  const [followingData, setFollowingData] = useState([]);
  const [totalFollowings, setTotalFollowings] = useState(0);
  const [followerName, setFollowerName] = useState("");
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const { userID, isMessage } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("User");
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setMessage(isMessage === "true" || isMessage === true);
        fetchFollowingData(parsedUser);
      } catch (error) {
        console.log("Error loading user:", error);
      }
    };

    getUser();
  }, []);

  const fetchFollowingData = async (currentUser) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/follow/getFollowingList/${
          userID || currentUser.userID
        }`
      );
      if (response.data.status === true) {
        const list = response.data.data;
        setFollowingData(list);
        if (list.length && list[list.length - 1].totalCount) {
          setTotalFollowings(list[list.length - 1].totalCount);
        }
        if (list.length) {
          const fullName = `${list[0].userFirstName} ${list[0].userSurname}`;
          setFollowerName(fullName);
        }
      }
    } catch (error) {
      console.log("Error fetching following data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
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
              ? { uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.profilePic}` }
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
        </View>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header />
      <View style={styles.container}>
        {message ? (
          <>
            <View style={styles.banner}>
              <Text style={styles.bannerText}>Special First-Time Offer!</Text>
              <Text style={styles.bannerSubText}>150% More</Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#FF7F50" style={{ marginTop: 50 }} />
            ) : (
              <FlatList
                data={followingData}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderItem}
              />
            )}
          </>
        ) : (
          <View style={styles.noMessagesTextContainer}>
            <Text style={styles.noMessagesText}>No messages to display.</Text>
          </View>
        )}
      </View>
      <Footer />
    </>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    padding: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  banner: {
    backgroundColor: "#FF7F50",
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
  messageContent: {
    flex: 1,
    marginLeft: 16,
  },
  messageName: {
    fontWeight: "600",
    fontSize: 15,
    color: "#222",
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
