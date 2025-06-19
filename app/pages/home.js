import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VideoCards from "../components/videoCards";
import Footer from "../components/footer";
import Header from "../components/header";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <>
      <Header />
      <View style={styles.container}>
        <VideoCards />
      </View>
      <Footer />
      <View style={styles.imageWrapper}>
       <TouchableOpacity onPress={() => console.log("Video call button pressed")}>
        <Image
          source={require("../../assets/images/video-camera.png")}
          style={styles.Videoimage}
        />
       </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageWrapper: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  Videoimage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});
