import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Pressable } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useState } from "react";
import { Database } from "./Database";
import { router, useRouter } from "expo-router";


const VideoCard = ({ url }) => {

  const router = useRouter();
  const [status, setStatus] = useState(null);
  
  return (

    <View style={styles.card}>
      <Video
        source={{ uri: url }}
        style={styles.image}
        isLooping
        resizeMode={ResizeMode.COVER}
        useNativeControls={false}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      {/* </TouchableOpacity> */}
    </View>
  );
};

const VideoList = () => {
  const onVideoHover = () => {
    router.push("../../pages/livePage");
  }
  return (
    
      <FlatList
        data={Database}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <VideoCard url={item.video} />}
        onTouchEndCapture={onVideoHover}
      />
    
  );
};

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "50%",  // Adjust width to fit the screen better
    height: 300,
    padding: 2,
    margin: "auto",
    minHeight: 350,
    backgroundColor: '#fff',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'nowrap'
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});


export default VideoList;

