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
  Animated,
  Alert,
  Modal,
  TextInput,
  PermissionsAndroid,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useRouter } from "expo-router";
import Header from "../components/header";
import VideoCards from "../components/videoCards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import { launchCamera } from "react-native-image-picker";
import UploadReels from "../components/UploadReels";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native";
import { Platform } from "react-native";
import { ActivityIndicator } from "react-native";

export default function ProfileScreen() {
  const [selectedImage, setSelectedImage] = useState([""]);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("untitled");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { height } = Dimensions.get("window");
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const profileData = {
    username: user ? user.userFirstName : "Loading...",
    profileImage: user.profilePic
      ? `${process.env.EXPO_PUBLIC_API_BASE_URL}${user.profilePic}`
      : "https://i.pinimg.com/736x/af/0d/7c/af0d7c8ce434deb503432cc5fce2c326.jpg", // Replace with actual image URL
    posts: user.posts ? user.posts : 0,
    followers: user.followers ? user.followers : 0,
    following: user.following ? user.following : 0,
    bio: `${
      user.bio
        ? user.bio
        : "Just for fun\n📍 Los Angeles\n💄 Digital Creator, Educator, Strategist\n✨ Director @fohr.co\n📩 Sign up for my newsletter"
    }`,
    website: "www.donyetaylor.com",
    postImages: [
      "https://your-image-url.com/post1.jpg",
      "https://your-image-url.com/post2.jpg",
      "https://your-image-url.com/post3.jpg",
    ],
  };

  useEffect(() => {
    const getUser = async () => {
      const User = await AsyncStorage.getItem("User");
      setUser(JSON.parse(User));
    };
    getUser();
  }, []);

  const openImagePicker = () => {
    const options = {
      mediaType: "video",
      includeBase64: false,
      videoQuality: "high", // Important
      quality: 1.0, // Force max quality
      durationLimit: 0, // No duration limit
    };
    launchImageLibrary(options, handleResponse);
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openImagePicker();
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: "video",
      includeBase64: false,
      videoQuality: "high", // Important
      quality: 1.0, // Force max quality
      durationLimit: 0,
    };

    launchCamera(options, handleResponse);
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      
    }
    Geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords),
      (error) => console.warn(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const showOptions = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const hideOptions = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.errorCode) {
      console.log("Image picker error: ", response.errorMessage);
    } else {
      const asset = response.assets?.[0];
      if (asset) {
        const { uri, fileName, type } = asset;

        setSelectedImage(uri);

        // Show modal to enter title and description
        hideOptions();
        setShowModal(true);
      }
    }
  };

  const handleUpload = async () => {
    hideOptions();
    setLoading(true);
    if (description !== "" || description !== null) {
      setShowModal(false); // Close the modal

      await UploadReels(
        user.userID,
        { uri: selectedImage, name: "upload.mp4", type: "video/mp4" },
        title,
        description
      );
      setLoading(false);
    } else {
      Alert.alert("Error", "Please provide a description.");
    }
  };

  


  return (
    <View style={styles.container}>
      <Header />

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profileData.profileImage }}
          style={styles.profileImage}
        />
        <View style={styles.statsContainer}>
          {/* <TouchableOpacity> */}
          <Text style={styles.statsText}>
            {profileData.posts}
            {"\n"}Posts
          </Text>
          {/* </TouchableOpacity> */}
          <TouchableOpacity onPress={() => router.push("../pages/followers")}>
            <Text style={styles.statsText}>
              {profileData.followers}
              {"\n"}Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("../pages/UserFollowing")}
          >
            <Text style={styles.statsText}>
              {profileData.following}
              {"\n"}Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.bioContainer}>
        <Text style={styles.username}>{profileData.username}</Text>
        <Text style={styles.bio}>{profileData.bio}</Text>
        {/* <Text style={styles.website}>{profileData.website}</Text> */}
      </View>

      <View style={styles.profileButtonContainer}>
        <TouchableOpacity onPress={() => router.push("../pages/editProfile")}>
          <Text style={styles.uploadButton}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showOptions}>
          <Text style={styles.uploadButton}>Add Post</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={modalVisible} animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={hideOptions}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleCameraLaunch()}
            >
              <Text style={styles.optionText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => openImagePicker()}
            >
              <Text style={styles.optionText}>Choose from Device</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* <View style={styles.containerVideo}>
        <VideoCards userID={user.userID} />
      </View> */}

      {loading ? (
        <View style={styles.loadingPanel}>
          <ActivityIndicator size={60} color={"white"} />
        </View>
      ) : (
        <></>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Post</Text>

              <TouchableOpacity onPress={() => handleUpload()}>
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            </View>

            {/* Image row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageRow}
            >
              {[1].map((_, index) => (
                <View key={index} style={styles.imagePreviewBox}>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.imagePreview}
                  />
                </View>
              ))}
            </ScrollView>

            {/* Caption input */}
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  containerVideo: {
    justifyContent: "center",
    alignItems: "center",
    padding:20
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
    justifyContent: "space-between",
    width: "100%",
  },
  profileButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
    // marginBottom: 0,
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
