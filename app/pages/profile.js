import React, { useState } from "react";
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useRouter } from "expo-router";
import Header from "../components/header";
import VideoCards from "../components/videoCards";
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

// Screens for Tabs
const GridView = () => (
  <FlatList
    data={profileData.postImages}
    keyExtractor={(item, index) => index.toString()}
    numColumns={3}
    renderItem={({ item }) => <Image source={{ uri: item }} style={styles.postImage} />}
  />
);

const ReelsView = () => (
  <View style={styles.centeredView}><Text>Reels Content</Text></View>
);

const TaggedView = () => (
  <View style={styles.centeredView}><Text>Tagged Posts</Text></View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "grid", title: "Grid" },
    { key: "reels", title: "Reels" },
    { key: "tagged", title: "Tagged" },
  ]);

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
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Follow</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Message</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Email</Text></TouchableOpacity>
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
  container: { flex: 1, 
    backgroundColor: "#fff",
     padding: 10 },
  profileContainer: { 
    flexDirection: "row", 
    alignItems: "center",
     marginVertical: 10 },
  profileImage: { width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginRight: 20 },
  statsContainer: { 
    flexDirection: "row",
     justifyContent: "space-around",
      flex: 1 },
  statsText: { 
    textAlign: "center",
     fontSize: 16, 
     fontWeight: "bold" },
  username: { 
    fontSize: 20, 
    fontWeight: "bold", 
    textAlign: "left" },
  bio: { 
    fontSize: 14,
    textAlign: "left",
     marginVertical: 5 },
  website: {
     fontSize: 14,
      color: "blue", 
      textAlign: "left", 
      marginBottom: 10 },
  buttonContainer: { 
    flexDirection: "row", 
    justifyContent: "space-around",
     marginBottom: 10 },
  button: {
     backgroundColor: "#ddd", 
     padding: 10,
      borderRadius: 5,
       width: "30%",
        alignItems: "center" },
  buttonText: { 
    fontSize: 14, 
    fontWeight: "bold" },
  postImage: { 
    width: 100, 
    height: 100,
     margin: 2 },
  centeredView: {
     flex: 1,
      justifyContent: "center",
       alignItems: "center" },
});

