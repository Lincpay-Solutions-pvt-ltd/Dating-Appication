import React, { useState,useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ChatFooter from "../components/ChatFooter";
import { useLocalSearchParams } from "expo-router";

export default function ChatScreen() {
  const navigation = useNavigation();
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const UserItem = useLocalSearchParams();
  const [profileData, setProfileData] = useState({});


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
    }, []);

  const handleBackPress = () => {
    navigation.navigate("chatList");
  };

  const handleCallPress = () => {
    setShowCallOptions(!showCallOptions);
    setShowProfileOptions(false);
  };

  const handleUsernamePress = () => {
    setShowProfileOptions(!showProfileOptions);
    setShowCallOptions(false);
  };

  const handleBackdropPress = () => {
    setShowProfileOptions(false);
    setShowCallOptions(false);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <View style={styles.profileSection}>
              {/* <Image
                source={
                  profilePic
                    ? {
                        uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${profilePic}`,
                      }
                    : item.userGender == 2
                    ? require("../../assets/images/profile-female.jpg")
                    : require("../../assets/images/profile.jpg")
                }
                style={styles.avatar}
              /> */}
              <TouchableOpacity
                onPress={handleUsernamePress}
                style={styles.userInfo}
              >
                <View style={styles.usernameContainer}>
                  <Text style={styles.username}>{profileData.username}</Text>
                  <Ionicons name="chevron-down" size={16} color="#000" />
                </View>
                <Text style={styles.status}>Active 39 min. ago</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCallPress}
            >
              <Ionicons name="call" size={24} color="#000" />
              <Ionicons
                name="chevron-down"
                size={14}
                color="#000"
                style={styles.callDownIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Chat area */}
          <View style={styles.chatArea}>
            {/* Chat messages would be rendered here */}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Profile Options */}
      {showProfileOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <FontAwesome
              name="image"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Media</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather
              name="user"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather
              name="share"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Share profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather
              name="bell-off"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Mute Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather
              name="trash-2"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Delete Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather
              name="flag"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Report User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather
              name="x-circle"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Block</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Call Options */}
      {showCallOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <FontAwesome
              name="video-camera"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <View style={styles.callOptionTextContainer}>
              <Text style={styles.optionText}>Premium Match Call</Text>
              <View style={styles.coinContainer}>
                <View style={styles.coinIcon} />
                <Text style={styles.coinText}>3,000/min</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons
              name="videocam-outline"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Video Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <MaterialIcons
              name="live-tv"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>1:1 Stream</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons
              name="call-outline"
              size={24}
              color="#000"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Audio Call</Text>
          </TouchableOpacity>
        </View>
      )}

      <ChatFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  backdrop: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f3f3",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 5,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  userInfo: {
    marginLeft: 10,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
  status: {
    color: "#000",
    fontSize: 14,
  },
  callButton: {
    padding: 5,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  callDownIcon: {
    marginLeft: 2,
  },
  chatArea: {
    flex: 1,
    padding: 20,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "#f3f3f3",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    zIndex: 10,
    maxHeight: "80%",
    overflow: "scroll",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
  },
  optionIcon: {
    marginRight: 15,
    width: 30,
  },
  optionText: {
    color: "#000",
    fontSize: 18,
  },
  callOptionTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFD700",
    marginRight: 5,
  },
  coinText: {
    color: "#000",
    fontSize: 16,
  },
});
