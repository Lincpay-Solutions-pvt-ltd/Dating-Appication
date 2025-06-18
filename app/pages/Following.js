import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Header from "../components/header";
import Footer from "../components/footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

export default function FollowingScreen() {
  const [followingData, setFollowingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUserAndFollowers = async () => {
      try {
        const userStr = await AsyncStorage.getItem("User");
        const user = JSON.parse(userStr);

        if (!user?.userID) {
          console.log("No user ID found");
          setMsg("User not found");
          setLoading(false);
          return;
        }

        console.log("Fetching following data for user:", user.userID);

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/follow/getFollowingList/${user.userID}`
        );

        if (response.data.status === true) {
          setFollowingData(response.data.data);
          if (response.data.data.length === 0) {
            setMsg("You are not following anyone yet.");
          }
        } else {
          setMsg("Failed to fetch following data");
        }
      } catch (error) {
        console.error("Error fetching following data:", error);
        setMsg("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    getUserAndFollowers();
  }, []);

  const OpenUserProfile = (item) => {
    router.push({
      pathname: "../pages/OtherProfile",
      params: { userData: JSON.stringify(item) },
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.profilePic ? (
        <TouchableOpacity onPress={() => OpenUserProfile(item)}>
          <Image
            source={{
              uri: `http://192.168.0.103:5000${item.profilePic}`,
            }}
            style={styles.image}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      <Header />

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : followingData.length === 0 ? (
        <Text style={styles.textMsg}>{msg}</Text>
      ) : (
        <FlatList
          contentContainerStyle={styles.cardContainer}
          data={followingData}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderItem}
        />
      )}

      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    paddingBottom: 80,
  },
  card: {
    width: 150,
    height: 150,
    borderRadius: 15,
    margin: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textMsg: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginTop: 50,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666",
  },
});
