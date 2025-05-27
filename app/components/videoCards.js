import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Pressable, Dimensions, ActivityIndicator } from "react-native";
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
        source={{ uri: `http://192.168.0.108:5000/reels${item.filepath}?token` }}
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
          source={{ uri: `http://192.168.0.108:5000${item.filepath}-thumbnail.png?token` }} style={styles.image} />
        {/* </TouchableOpacity> */}
        {/* <View style={styles.blackPanel} /> */}
      </View>
    
  );
};

const VideoList = (props) => {
  const [Database, setDatabase] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [haveMoreReels, setHaveMoreReels] = useState(false);

  useEffect(() => {
    props.userID ?
      fetchReel({ userID: props.userID }) :
      fetchReel({ pageNumber: 1 });
  }, [props]);

  useEffect(() => {
    console.log("Page Number Updatd= ", pageNumber);

  }, [pageNumber]);

  const fetchReel = async ({ userID = null, pageNumber = 1 }) => {
    console.log("New Page no = ", pageNumber);

    var API = userID ? `http://192.168.0.108:5000/api/v1/reels/by-userID/${userID}?page=${pageNumber}&limit=10` : `http://192.168.0.108:5000/api/v1/reels/get-latest?page=${pageNumber}&limit=10`
    axios.get(API)
      .then((response) => {
        setDatabase((prev) => [...prev, ...response.data.data]);
        const lastJson = response.data.data[response.data.data.length - 1];
        console.log("lastJson = ", lastJson.haveMore);
        setHaveMoreReels(lastJson.haveMore);
        return response.data
      })
      .catch((error) => {
        console.log(error);
      })
  };

  const CheckLastReel = async () => {
    console.log("Last Reel Reached");
    if (haveMoreReels) {
      console.log("Fetching Reels . . . .   ");
      console.log("pageNumber", pageNumber);
      setPageNumber((prev) => prev + 1);
      props.userID ?
        fetchReel({ userID: props.userID, pageNumber: pageNumber + 1 }) :
        fetchReel({ pageNumber: pageNumber + 1 });
    }

  }




  return (

    <FlatList style={styles.container}
      width={Dimensions.get("screen").width}
      data={Database}
      numColumns={2}
      contentContainerStyle={{ padding : 0 }}
      horizontal={false}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
      renderItem={({ item }) => { return <VideoCard item={item} /> }}
      onEndReached={CheckLastReel}
      onEndReachedThreshold={0.5}
    //onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}

    />
  );
};

let width = Dimensions.get("screen").width / 2;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },
  
  card: {
    //display: 'flex',
    //justifyContent: 'space-between',
    // alignItems: 'center',
    width: width - 15,  // Adjust width to fit the screen better
    height: 300,
    padding: 0,
    margin: 2,
    borderRadius: 50,
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
    borderRadius: 5,
  },
  imageContainer: {
    position: 'relative',
  },
});


export default VideoList;

