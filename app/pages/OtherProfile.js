import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Footer from "../components/footer";

import Header from "../components/header";
import VideoCards from "../components/videoCards";

export default function OtherProfileScreen() {
  const router = useRouter();
  const UserItem = useLocalSearchParams();

  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUserName, setProfileUserName] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [userGender, setUserGender] = useState(null);

  const followToUserID =
    UserItem?.userID ||
    (UserItem?.userData && JSON.parse(UserItem.userData)?.userID);

  useEffect(() => {
    if (!followToUserID) return;

    const loadProfile = async () => {
      try {
        const user = await AsyncStorage.getItem("User");
        if (user) {
          const parsed = JSON.parse(user);
          setCurrentUserID(parsed.userID);
          setProfileUserName(`${parsed.userFirstName} ${parsed.userSurname}`);
          setUserGender(UserItem.gender || parsed.userGender);

          await fetchFollowStatus(parsed.userID, followToUserID);
        }

        const data =
          UserItem?.userData &&
          typeof UserItem.userData === "string" &&
          JSON.parse(UserItem.userData).totalFollowers
            ? JSON.parse(UserItem.userData)
            : await fetchUserFromAPI(followToUserID);

        if (data) {
          setProfileData({
            userID: data.userID,
            username: `${data.userFirstName} ${data.userSurname}`,
            profileImage: data.profilePic
              ? `${process.env.EXPO_PUBLIC_API_BASE_URL}${data.profilePic}`
              : `set-default-${data.userGender}`,
            posts: data.posts || 0,
            followers: data.totalFollowers || 0,
            following: data.followings || 0,
            bio: data.userBio || "✨ No bio available",
            userEmail: data.userEmail,
          });
        }
      } catch (err) {
        console.error("Profile load error:", err);
      }
    };

    loadProfile();
  }, []);

  const fetchUserFromAPI = async (userID) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users/by-userID/${userID}`
      );
      const json = await res.json();
      return json.data[0];
    } catch (err) {
      console.error("Fetch user API error:", err);
      return null;
    }
  };

  const fetchFollowStatus = async (fromID, toID) => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/follow/checkFollow`,
        { followBy: fromID, followTo: toID }
      );
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error("Check follow error:", err?.response?.data || err.message);
    }
  };

  const followUser = async () => {
    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/follow/follow`,
        { followBy: currentUserID, followTo: followToUserID }
      );
      setIsFollowing(true);
    } catch (err) {
      console.error("Follow error:", err.response);
    }
  };

  const unfollowUser = async () => {
    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/follow/unfollow`,
        { followBy: currentUserID, followTo: followToUserID }
      );
      setIsFollowing(false);
    } catch (err) {
      console.error("Unfollow error:", err.response);
    }
  };

  if (!profileData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  return (
  <>
    <Header />
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={
            profileData.profileImage.startsWith("set-default")
              ? profileData.profileImage === "set-default-2"
                ? require("../../assets/images/profile-female.jpg")
                : require("../../assets/images/profile.jpg")
              : { uri: profileData.profileImage }
          }
          style={styles.profileImage}
        />

        <View style={styles.statsContainer}>
          <TouchableOpacity>
            <Text style={styles.statsText}>
              {profileData.posts}
              {"\n"}Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../pages/followers",
                params: { userID: profileData.userID },
              })
            }
          >
            <Text style={styles.statsText}>
              {profileData.followers}
              {"\n"}Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../pages/UserFollowing",
                params: { userID: profileData.userID },
              })
            }
          >
            <Text style={styles.statsText}>
              {profileData.following}
              {"\n"}Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.username}>{profileData.username}</Text>
        <Text style={styles.bio}>{profileData.bio}</Text>
      </View>

      <View style={styles.profileButtonContainer}>
        <TouchableOpacity onPress={isFollowing ? unfollowUser : followUser}>
          <Text style={styles.uploadButton}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "../pages/chats",
              params: {
                id: currentUserID,
                name: profileUserName,
                profilePic: profileData.profileImage,
                gender: userGender,
              },
            })
          }
        >
          <Text style={styles.uploadButton}>Message</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          //display: props.userID ? "flex" : "none",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
        <View>
          <Text
            style={{ ...styles.text, ...{ width: 70, textAlign: "center" } }}
          >
            Posts
          </Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
      </View>

      <View style={styles.containerVideo}>
        <VideoCards userID={profileData.userID} />
      </View>
    </View>
    <Footer />
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  containerVideo: {
    justifyContent: "center",
    alignItems: "center",
    height: "60%", // or any appropriate fixed height
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  statsText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  bioContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20, // ensures space at bottom
    marginTop: 10,
    flexShrink: 1, // allows container to shrink if needed
  },
  bio: {
    fontSize: 14,
    textAlign: "left",
    lineHeight: 20, // improves readability and avoids clipping
    flexWrap: "wrap",
    marginTop: 4,
  },
  website: {
    fontSize: 14,
    color: "blue",
    textAlign: "left",
    marginBottom: 10,
  },
  postImage: {
    width: 100,
    height: 100,
    margin: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginTop: 100,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 75,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Better spacing between buttons
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
  },

  uploadButton: {
    marginTop: 10,
    fontSize: 20,
    borderColor: "black",
    padding: 10,
    width: 150,
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "#d8d9da",
    color: "#000",
  },

  overlay: {
    flex: 1,
    backgroundColor: "#00000077",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  option: {
    padding: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  postCancelButton: {
    fontSize: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
    textAlign: "center",
    backgroundColor: "#d91859",
    color: "white",
  },
  cancelText: {
    color: "white",
    fontSize: 20,
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "white",
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "80%", // You can reduce this
    height: "100%", // Add this line for fixed height
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  shareText: {
    color: "#0095f6",
    fontWeight: "600",
    fontSize: 20,
  },
  imageRow: {
    flexDirection: "row",
    marginTop: 25,
  },
  imagePreviewBox: {
    marginRight: 10,
    marginBottom: 20,
    left: 50,
    padding: 10,
    justifyContent: "center",
  },
  imagePreview: {
    width: 250,
    height: 400,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  addMoreButton: {
    width: 150,
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  captionInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  loadingPanel: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    sizeMode: "cover",
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  profileButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
