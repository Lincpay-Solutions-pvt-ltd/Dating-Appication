import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useState, useEffect } from "react";
import { Database } from "./Database";
import { router, useRouter } from "expo-router";
import axios from "axios";
const _db = Database;

const VideoCard = ({ item }) => {
  const router = useRouter();

  return (
    <View style={styles.card}>

      <Image
        onTouchEndCapture={() => {
          router.push({
            pathname: "../../pages/reels",
            params: { reel: JSON.stringify(item) },
          });
        }}
        resizeMode={ResizeMode.COVER}
        source={{
          uri: `http://192.168.0.103:5000${item.filepath}-thumbnail.png?token`,
        }}
        style={styles.image}
      />
    </View>
  );
};

const VideoList = (props) => {
  const [Database, setDatabase] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [haveMoreReels, setHaveMoreReels] = useState(false);

  useEffect(() => {
    props.userID
      ? fetchReel({ userID: props.userID })
      : fetchReel({ pageNumber: 1 });
  }, [props]);

  const fetchReel = async ({ userID = null, pageNumber = 1 }) => {

    var API = userID
      ? `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/reels/by-userID/${userID}?page=${pageNumber}&limit=10`
      : `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/reels/get-latest?page=${pageNumber}&limit=10`;
    axios
      .get(API)
      .then((response) => {
        setDatabase((prev) => [...prev, ...response.data.data]);
        const lastJson = response.data.data[response.data.data.length - 1];
        setHaveMoreReels(lastJson.haveMore);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const CheckLastReel = async () => {
    if (haveMoreReels) {
      setPageNumber((prev) => prev + 1);
      props.userID
        ? fetchReel({ userID: props.userID, pageNumber: pageNumber + 1 })
        : fetchReel({ pageNumber: pageNumber + 1 });
    }
  };

  return (
    <FlatList
      style={styles.container}
      width={Dimensions.get("screen").width}
      data={Database}
      numColumns={2}
      contentContainerStyle={{ padding: 0 }}
      horizontal={false}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      keyExtractor={(item, index) => `${item.id ?? "no-id"}-${index}`}
      renderItem={({ item }) => <VideoCard item={item} />}
      onEndReached={CheckLastReel}
      onEndReachedThreshold={0.5}
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
    width: width - 15, // Adjust width to fit the screen better
    height: 300,
    padding: 0,
    margin: 2,
    borderRadius: 50,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "nowrap",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 5,
  },
  imageContainer: {
    position: "relative",
  },
});

export default VideoList;
