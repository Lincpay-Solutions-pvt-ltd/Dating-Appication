import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default ExploreScreen = () => {
  const [searchText, setSearchText] = useState(null);
  const router = useRouter();
  const [Database, setDatabase] = useState([]);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  useMemo(() => {
    const getUser = async () => {
      try {
        const user = await AsyncStorage.getItem("User");
        const _accessToken = await AsyncStorage.getItem("accessToken");

        if (user) {
          const parsedUser = JSON.parse(user);
          const userID = parsedUser.userID;
          setCurrentUserID(userID);
          setAccessToken(_accessToken);

        }
      } catch (err) {
        console.error("Error parsing user from AsyncStorage", err);
      }
    };
    getUser();
  }, []);

  const showUserAccount = async (name) => {
    try {
      const response = await axios.get(
        `http://192.168.0.101:5000/api/v1/users/allUsers?search=${name}`, // Adjust the URL as needed
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const fetchedReels = response.data.data;
      setShowSearch(true);

      // Filter out the current user from the fetched reels
      const filteredReels = fetchedReels.filter(
        (item) => item.userID !== currentUserID
      );

      setDatabase(filteredReels);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (text) => {
    await showUserAccount(text);
  };

  const OpenUserProfile = (item) => {
    // router.push("../pages/OtherProfile");
    router.push({
      pathname: "../pages/OtherProfile",
      params: { userData: JSON.stringify(item) },
    });
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search By UserName"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              if (text.length >= 3) {
                handleSearch(text);
              } else {
                setShowSearch(false);
              }
            }}
            placeholderTextColor="#888"
          />
        </View>
        <FlatList
          data={Database}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            showSearch && (
              <View style={styles.messageItem}>
                <Image
                  source={require("../../assets/images/profile.jpg")}
                  style={styles.messageAvatar}
                />
                <TouchableOpacity onPress={() => OpenUserProfile(item)}>
                  <View style={styles.messageContent}>
                    <Text style={styles.messageName}>
                      {item.userFirstName} {item.userSurname}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }
        />
      </View>
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    color: "#000",
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
    color: "#000",
    fontSize: 14,
  },
  name: {
    color: "#000",
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
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    fontSize: 20,
    marginBottom: 10,
    color: "#000",
    marginLeft: 15,
    marginRight: 15,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageContent: {
    flex: 1,
    marginLeft: 10,
  },
  messageName: {
    padding: 10,
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
});
