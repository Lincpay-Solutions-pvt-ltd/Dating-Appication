import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";

import IoniconsIcons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { launchImageLibrary } from "react-native-image-picker";
import { launchCamera } from "react-native-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfileScreen() {
  const [name, setName] = useState("Debangshu Das");
  const [currentUserFirstName, setCurrentUserFirstName] = useState("Testing");
  const [currentUserSurName, setCurrentUserSurName] = useState("Dev");
  //const [pronouns, setPronouns] = useState("");
  const [userBio, setUserBio] = useState("No bio");
  const [user, setUser] = useState({});
  const [gender, setGender] = useState("Male");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    "https://ca1e-103-198-98-77.ngrok-free.app/api/v1/uploads/win_20250529_13_01_49_pro-1748503944346.jpg?dfault=0"
  ); // Default image

  //const [userProfileData, setUserProfileData] = useState(username,userBio,userGender, /*userProfileImage*/);
  const router = useRouter();
  const { height } = Dimensions.get("window");
  const slideAnim = useRef(new Animated.Value(height)).current;
  //const [showThreadsBadge, setShowThreadsBadge] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const User = await AsyncStorage.getItem("User");
      const current_User = JSON.parse(User);
      setUser(current_User);
      setSelectedImage(`${current_User.profilePic}`);
      setCurrentUserID(current_User.userID);
    };
    getUser();
  }, []);

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

  const openImagePicker = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
      quality: 1.0, // Optional: highest quality image
    };
    launchImageLibrary(options, handleResponse);
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
      quality: 1.0, // Force max quality
      durationLimit: 0,
    };
    launchCamera(options, handleResponse);
  };

  const handleResponse = async (response) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.errorCode) {
      console.log("Image picker error: ", response.errorMessage);
    } else {
      const asset = response.assets?.[0];
      if (asset) {
        const { uri, fileName, type } = asset;

        try {
          const formData = new FormData();

          // Append the userID as a regular field
          formData.append("userID", currentUserID);

          // Append the file - structure is important
          formData.append("file", {
            uri: uri, // Local file URI
            name: "upload.jpg", // File name
            type: "image/jpg", // MIME type
          });

          const response = await axios.post(
            "https://ca1e-103-198-98-77.ngrok-free.app/api/v1/uploads/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            setSelectedImage(response.data.filePath);
            hideOptions();
          } else {
            alert("Failed to upload image. Please try again.");
          }
        } catch (error) {
          alert("An error occurred while uploading the image.",error.message);
        }
      }
    }
    setModalVisible(false);
  };

  

  const savingData = async () => {
  try {
    console.log("Saving data...");
    const data = JSON.stringify({
      userID: currentUserID,
      userFirstName : currentUserFirstName,
      bio : userBio,
      gender:gender,
      profilePic: selectedImage,
    });

    const response = await axios.post(
      `https://ca1e-103-198-98-77.ngrok-free.app/api/v1/users/update-user`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      console.log("Data saved successfully:", response.data);
      const profileData = {
        userID: currentUserID,
        userFirstName : currentUserFirstName,
        bio : userBio,
        gender,
        profilePic: selectedImage,
      };

      await AsyncStorage.setItem("User", JSON.stringify(profileData));
      console.log("User data saved to AsyncStorage");

      Alert.alert(
        "Success",
        "Profile saved successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("../pages/profile"); // Navigate to profile page
              // navigation.navigate('Profile'); // <- Adjust based on your navigation
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      console.error("Error saving data:", response.statusText);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    Alert.alert("Error", "Something went wrong. Please try again later.");
  }
};

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <IoniconsIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit profile</Text>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: `https://ca1e-103-198-98-77.ngrok-free.app${selectedImage}` }}
            style={styles.avatar}
          />
          <TouchableOpacity onPress={showOptions}>
            <Text style={styles.changePic}>Change profile picture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>UserFirstName</Text>
          <TextInput
            style={styles.input}
            value={currentUserFirstName}
            onChangeText={setCurrentUserFirstName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput style={styles.input} value={userBio} onChangeText={setUserBio} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            value={gender}
            onChangeText={setGender}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => savingData()}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
    flex: 1,
  },
  title: {
    fontSize: 20,
    paddingLeft: 20,
    color: "black",
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  changePic: {
    marginTop: 10,
    color: "#3b82f6",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: "black",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#d8d9da",
    color: "black",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textLink: {
    marginBottom: 15,
  },
  linkText: {
    color: "#bbb",
    textDecorationLine: "underline",
  },
  musicRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 60,
  },
  switchSubText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
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
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
