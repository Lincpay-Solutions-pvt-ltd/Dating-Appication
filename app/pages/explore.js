import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const data = [
  {
    id: "1",
    name: "Name",
    image: "https://picsum.photos/200/300", // Replace with actual image URL
    views: "7",
    likes: "1.22M",
  },
  {
    id: "2",
    name: "Name",
    image: "https://picsum.photos/200/300",
    views: "14",
    likes: "22.57M",
  },
  {
    id: "3",
    name: "Name",
    image: "https://picsum.photos/200/300",
    views: "14",
    likes: "22.57M",
  },
  {
    id: "4",
    name: "Name",
    image: "https://picsum.photos/200/300",
    views: "14",
    likes: "22.57M",
  },
  {
    id: "5",
    name: "Name",
    image: "https://picsum.photos/200/300",
    views: "14",
    likes: "22.57M",
  },
  {
    id: "6",
    name: "Name",
    image: "https://picsum.photos/200/300",
    views: "14",
    likes: "22.57M",
  },
];

const { width } = Dimensions.get("window");
const titles = ["Nearby", "New", "Gamer", "Artists"];

export default ExploreScreen = () => {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const fetchReelsByUserName = async ({ userName }) => {
    try {
      const response = await axios.get(
        `http://192.168.0.108:5000/api/v1/reels/get-latest?page=${pageNumber}&limit=10`
      );
      const fetchedReels = response.data.data;
      console.log("fetchedReels First", fetchedReels[0]);
      const lastJson = fetchedReels[fetchedReels.length - 1];
      setHaveMoreReels(lastJson.haveMore);
 
      setDatabase((prev) => [...prev, ...fetchedReels]);

      console.log("Database length= ", Database.length);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    console.log("Search input changed:", text);
    // Optionally call a search function here
  };

  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search By UserName"
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#888"
          />
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="magnify"
              size={35}
              margin={15}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        {titles.map((title, index) => (
          <View key={index}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              onPress={() => router.push("../pages/exploreMore")}
            >
              <Text
                style={[
                  styles.moreText,
                  { alignSelf: "flex-end", marginRight: 15 },
                ]}
              >
                More
              </Text>
            </TouchableOpacity>
            <FlatList
              data={data}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.overlay}>
                    <Text style={styles.views}>👁 {item.views}</Text>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.likes}>💎 {item.likes}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        ))}
      </ScrollView>
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 15,
    top: 13,
  },
  moreText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    bottom: 15,
  },
  card: {
    width: width * 0.5,
    height: 300,
    margin: 3,
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 5,
    borderRadius: 5,
  },
  views: {
    color: "#fff",
    fontSize: 14,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  likes: {
    color: "#fff",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    fontSize: 20,
    marginBottom: 10,
    color: "#fff",
    marginLeft: 15,
    marginRight: 15,
  },
});
