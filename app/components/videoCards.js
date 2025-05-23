import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Pressable, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useState, useEffect } from "react";
import { Database } from "./Database";
import { router, useRouter } from "expo-router";
import axios from "axios";
const _db = Database


const VideoCard = ({ item }) => {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const { height } = Dimensions.get('window');
  


  return (
    <View style={styles.card}>
      {/* <TouchableOpacity onPress={() => router.push({ pathname: "../../pages/reels", query: { item: item } })}> */}
      {/* <Video
        source={{ uri: `http://192.168.0.101:5000/reels${item.filepath}?token` }}
        style={styles.image}
        isLooping={false}
        resizeMode={ResizeMode.COVER}
        useNativeControls={false}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        onTouchEndCapture={() => {
          router.push(
            {
              pathname: "../../pages/reels",
              params: { reel: JSON.stringify(item) }
            })
        }
        }
        onError={(error) => {
          console.error('Video Playback Error:', error);
        }}
        posterStyle={{ resizeMode: 'cover' }}
      /> */}
      <Image
        onTouchEndCapture={() => {
          router.push(
            {
              pathname: "../../pages/reels",
              params: { reel: JSON.stringify(item) }
            })
        }
        }
        resizeMode={ResizeMode.COVER}
        source={{ uri: `http://192.168.0.101:5000${item.filepath}-thumbnail.png?token` }} style={styles.image} />
      {/* </TouchableOpacity> */}
    </View>
  );
};

const VideoList = (props) => {
  const [Database, setDatabase] = useState([]);
  const [videoComments, setVideoComments] = useState({});

  useEffect(() => {
    props.userID ?
      fetchReel(props.userID) :
      fetchReel();


  }, [props]);

  const fetchReel = async (userID = null) => {
    var API = userID ? `http://192.168.0.101:5000/api/v1/reels/by-userID/${userID}` : "http://192.168.0.101:5000/api/v1/reels/get-latest"
    axios.get(API)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const initialComments = {};
        response.data.data.forEach((video) => {
          initialComments[video.video] = [
            { user: "User1", comment: "Great video!" },
            { user: "User2", comment: "Amazing content!" },
          ];
        });
        setVideoComments(initialComments);

        setDatabase(response.data.data);
        return response.data
      })
      .catch((error) => {
        console.log(error);
      })
  };

  return (

    // <View style={styles.container}>
      <FlatList style={styles.container}
        width = {Dimensions.get("screen").width-20}
        data={Database}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ alignItems: "flex-start" }}
        horizontal = {false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <VideoCard item={item} />}
      />
    //</View> }

  );
};

let width = Dimensions.get("screen").width/2;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin:"auto",
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width - 20,  // Adjust width to fit the screen better
    height: 300,
    padding: 0,
    margin: 5,
    minHeight: 250,
    borderRadius: 20,
    borderBlockColor: "red",
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 1,
    // shadowRadius: 10,
    boxShadow: "0 1px 20pxrgba(0, 0, 0, 0.44)",

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
    borderRadius: 10,
  },
});


export default VideoList;

