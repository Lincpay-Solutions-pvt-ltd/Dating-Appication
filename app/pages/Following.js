import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import Header from "../components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../components/footer";
import axios from "axios";
import { useRouter } from "expo-router";

export default function FollowingScreen() {
  const [videos, setVideos] = useState([]);
  const [msg, setMsg] = useState("loading...");
  const [user, setUser] = useState({});
  const [followingData, setFollowingData] = useState([]);
  const router = useRouter();

  useMemo(() => {
    const getUser = async () => {
      const User = await AsyncStorage.getItem("User");
      setUser(JSON.parse(User));
      showFollowers(JSON.parse(User));
    };
    getUser();
  }, []);

  const showFollowers = async (user) => {
    console.log("Fetching following data for user:", user.userID);

    try {
      const response = await axios.get(
        `https://58f7-182-70-116-29.ngrok-free.app/api/v1/follow/getFollowingList/${user.userID}`
      );
      if (response.data.status === true) {
        setFollowingData(response.data.data);
      } else {
        console.error("Failed to fetch following data");
      }
    } catch (error) {
      console.error("Error fetching following data:", error);
    }
  };

  const OpenUserProfile = (item) => {
    router.push({
      pathname: "../pages/OtherProfile",
      params: { userData: JSON.stringify(item) },
    });
  };

  const VideoList = () => {
    return videos.length ? (
      <Text style={styles.textMsg}>{msg}</Text>
    ) : (
      <View style={styles.cardContainer}>
        <FlatList
          data={followingData}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.profilePic ? (
                <TouchableOpacity onPress={() => OpenUserProfile(item)}>
                  <Image
                    source={{
                      uri: `https://58f7-182-70-116-29.ngrok-free.app${item.profilePic}`,
                    }}
                    style={styles.card}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <>
    <Header />
      <FlatList
        // ListHeaderComponent={
        //   <>
        //     <SafeAreaView>
        //       {/* <View style={styles.containerTop}>
        //                         <MaterialCommunityIcons
        //                             style={styles.icon}
        //                             name="account-group-outline"
        //                             size={100}
        //                             color="#000"
        //                         />
        //                         <Text style={styles.followingText}>No active Followings yet</Text>
        //                     </View> */}
        //       {/* <View style={styles.containerMid}>
        //         <Text style={styles.text}>Following</Text>
        //       </View> */}
        //     </SafeAreaView>
        //   </>
        // }
        data={[{ key: "VideoList" }]} // Placeholder data
        renderItem={() => <VideoList />}
        keyExtractor={(item) => item.key}
      />
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  containerTop: {
    display: "flex",
    backgroundColor: "#fff",
  },
  containerMid: {
    display: "flex",
    padding: 30,
    backgroundColor: "#fff",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 100,
    padding: 30,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  followingText: {
    fontSize: 30,
    color: "#000",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingBottom: 10,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",

  },
  card: {
    width: 150, // Adjust width to fit the screen better
    height: 150,
    padding: 2,
    borderRadius: 30,
    marginLeft: 5,
    marginTop:10
  },
  textMsg: {
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "nowrap",
    fontSize: 20,
    marginTop: 50,
  },
  image: {
    width: "50%",
    height: "50%",
    objectFit: "cover",
  },
});
