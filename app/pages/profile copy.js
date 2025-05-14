import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, FlatList, Dimensions,Animated, Alert } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useRouter } from "expo-router";
import Header from "../components/header";
import VideoCards from "../components/videoCards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {launchImageLibrary} from 'react-native-image-picker';
import {launchCamera} from 'react-native-image-picker';
import { PermissionsAndroid } from "react-native";


export default function ProfileScreen() {

  const [selectedImage,setSelectedImage] = useState(['']);
  const router = useRouter();
  const [user, setUser] = useState({});
  const [index, setIndex] = useState(0);
  
  const [routes] = useState([
    { key: "grid", title: "Grid" },
    { key: "reels", title: "Reels" },
    { key: "tagged", title: "Tagged" },
  ]);
  useEffect(() => {
    const getUser = async () => {
      const User = await AsyncStorage.getItem("User");
      setUser(JSON.parse(User));
    };
    getUser();
  }, []);


  const profileData = {
    username: "donyetaylor",
    profileImage: "https://i.pinimg.com/736x/af/0d/7c/af0d7c8ce434deb503432cc5fce2c326.jpg", // Replace with actual image URL
    posts: 536,
    followers: "39,3K",
    following: 1629,
    bio: "Just for fun\n📍 Los Angeles\n💄 Digital Creator, Educator, Strategist\n✨ Director @fohr.co\n📩 Sign up for my newsletter",
    website: "www.donyetaylor.com",
    postImages: [
      "https://your-image-url.com/post1.jpg",
      "https://your-image-url.com/post2.jpg",
      "https://your-image-url.com/post3.jpg",
    ],
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message:
            'App needs access to your camera ' +
            'so you can take pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handlePress= async () => {
    await requestCameraPermission();
    Alert.alert(
      'Choose an Option',
      'Do you want to take a photo or choose from gallery?',
      [
        {
          text: 'Take Photo',
          onPress: handleCameraLaunch,
        },
        {
          text: 'Choose from Gallery',
          onPress: openImagePicker,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }


  const openImagePicker = () => {
    const options = {
      mediaType: 'video',
    };
    console.log("options = ",options);
    
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error: ', response.errorCode);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log("imageUri = ",imageUri);
        
      }
    });
  };


  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
  
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorCode);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        console.log(imageUri);
      }
    });
  }

  // Screens for Tabs
  const GridView = () => (
    <FlatList
      data={profileData.postImages}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3}
      renderItem={({ item }) => <Image source={{ uri: item }} style={styles.postImage} />}
    />
  );

  const ReelsView = () => {
    return (
      <VideoCards userID={user.userID} />
    )
  };

  const TaggedView = () => (
    <View style={styles.centeredView}><Text>Tagged Posts</Text></View>
  );
  const renderScene = SceneMap({
    grid: GridView,
    reels: ReelsView,
    tagged: TaggedView,
  });

  return (
    <View style={styles.container}>
      <Header />

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
        <View style={styles.statsContainer}>
          <TouchableOpacity><Text style={styles.statsText}>{profileData.posts}{"\n"}Posts</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.statsText}>{profileData.followers}{"\n"}Followers</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.statsText}>{profileData.following}{"\n"}Following</Text></TouchableOpacity>
        </View>
      </View>

      {/* Bio Section */}
      <Text style={styles.username}>{profileData.username}</Text>
      <Text style={styles.bio}>{profileData.bio}</Text>
      <TouchableOpacity><Text style={styles.website}>{profileData.website}</Text></TouchableOpacity>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePress} style={styles.button}><Text style={styles.buttonText}>Upload Post</Text></TouchableOpacity>
      </View>

      


      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "black" }}
            style={{ backgroundColor: "white" }}
            activeColor="black"
            inactiveColor="gray"
          />

        )}
      />


      {/* Back Button */}
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1
  },
  statsText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold"
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left"
  },
  bio: {
    fontSize: 14,
    textAlign: "left",
    marginVertical: 5
  },
  website: {
    fontSize: 14,
    color: "blue",
    textAlign: "left",
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10
  },
  button: {
    backgroundColor: "#FE9292",
    padding: 14,
    borderRadius: 5,
    width: "60%",
    alignItems: "center",
    borderRadius: 25
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  postImage: {
    width: 100,
    height: 100,
    margin: 2
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});

