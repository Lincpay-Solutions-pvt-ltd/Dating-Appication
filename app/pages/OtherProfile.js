import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  PermissionsAndroid,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../components/header";
import VideoCards from "../components/videoCards";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ActivityIndicator } from "react-native";
import axios from "axios";

export default function OtherProfileScreen() {
  const UserItem = useLocalSearchParams();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileUserName, setProfileUserName] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [currentUserID, setCurrentUserID] = useState(null);

  const [followToUserID, setFollowToUserID] = useState(
    UserItem?.userID
      ? UserItem.userID
      : UserItem?.userData
      ? JSON.parse(UserItem?.userData).userID
      : null
  );

  useMemo(() => {
    if (UserItem.userData) {
      console.log("First", UserItem.userData);

      const userData_ = JSON.parse(UserItem.userData);
      setFollowToUserID(userData_.userID);

      setProfileData({
        userID: userData_.userID,
        username: userData_
          ? userData_.userFirstName + userData_.userSurname
          : "Loading...",
        profileImage: userData_.profilePic
          ? `${process.env.EXPO_PUBLIC_API_BASE_URL}${userData_.profilePic}`
          : `set-default-${userData_.userGender}`, // Replace with actual image URL
        posts: userData_.posts ? userData_.posts : 0,
        followers: userData_.totalFollowers ? userData_.totalFollowers : 0,
        following: userData_.followings ? userData_.followings : 0,
        bio: `${
          userData_.userBio ? userData_.userBio : "✨ No bio available "
        }`,
        website: "www.donyetaylor.com",
        postImages: [
          "https://your-image-url.com/post1.jpg",
          "https://your-image-url.com/post2.jpg",
          "https://your-image-url.com/post3.jpg",
        ],
        userEmail: userData_.userEmail,
      });
    } else if (UserItem.userID) {
      // hit api to get user data by userID
      setFollowToUserID(UserItem.userID);

      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users/by-userID/${UserItem.userID}`
          );
          const data = await response.json();
          const userData_ = data.data.length ? data.data[0] : {};
          console.log("Second", userData_);

          setProfileData({
            userID: userData_.userID,
            username:
              userData_.userFirstName + " " + userData_.userSurname ||
              "Undefined",
            profileImage: userData_.profilePic
              ? `${process.env.EXPO_PUBLIC_API_BASE_URL}${userData_.profilePic}`
              : `set-default-${userData_.userGender}`,

            posts: userData_.posts,
            followers: `${userData_.totalFollowers}`,
            following: `${userData_.followings}`,
            bio: `${
              userData_.userBio ? userData_.userBio : "✨ No bio available "
            }`,
            website: "www.donyetaylor.com",
            postImages: [
              "https://your-image-url.com/post1.jpg",
              "https://your-image-url.com/post2.jpg",
              "https://your-image-url.com/post3.jpg",
            ],
            userEmail: userData_.userEmail,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }

    const getUser = async () => {
      try {
        const user = await AsyncStorage.getItem("User");

        if (user) {
          const parsedUser = JSON.parse(user);
          const userID = parsedUser.userID;
          setCurrentUserID(userID);
          const fullName =
            parsedUser.userFirstName + " " + parsedUser.userSurname;
          setProfileUserName(fullName);

          fetchFollowStatus(userID, followToUserID);
        }
      } catch (err) {
        console.error("Error parsing user from AsyncStorage", err);
      }
    };

    getUser();
  }, []);

  const fetchFollowStatus = async (currentUserID, followToUserID) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/follow/checkFollow`,
        {
          followBy: currentUserID,
          followTo: followToUserID,
        }
      );
      console.log("Check Follow Response =", response.data);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error in checking follow user", error.response.data);
    }
  };

  const followUser = async () => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/follow/follow`,
        {
          followBy: currentUserID,
          followTo: followToUserID,
        }
      );
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error.response);
    }
  };

  const unfollowUser = async () => {
    try {
      const response = axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/follow/unfollow`,
        {
          followBy: currentUserID,
          followTo: followToUserID,
        }
      );
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {profileData == {} ? (
        <></>
      ) : (
        <View style={styles.profileContainer}>
          <Image
            source={
              profileData.profileImage &&
              profileData.profileImage.startsWith("set-default")
                ? profileData.profileImage == "set-default-2"
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
      )}

      {/* Bio Section */}
      <View style={styles.bioContainer}>
        <Text style={styles.username}>{profileData.username}</Text>
        <Text style={styles.bio}>{profileData.bio}</Text>
        {/* <Text style={styles.website}>{profileData.website}</Text> */}
      </View>

      <View style={styles.buttonContainer}>
        {isFollowing ? (
          <TouchableOpacity onPress={unfollowUser}>
            <Text style={styles.uploadButton}>Unfollow</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={followUser}>
            <Text style={styles.uploadButton}>Follow</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity>
          <Text style={styles.uploadButton}>Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerVideo}>
        <VideoCards userID={profileData.userID} />
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  containerVideo: {
    justifyContent: "center",
    alignItems: "center",
    height: 510, // or any appropriate fixed height
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
    flex: 1, // allows container to shrink if needed
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
    marginBottom: 12,
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
});
