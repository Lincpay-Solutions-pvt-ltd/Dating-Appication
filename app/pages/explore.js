import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function ExploreScreen() {
  const [searchText, setSearchText] = useState("");
  const [database, setDatabase] = useState([]);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef(null);

  const router = useRouter();

  // Fetch user info on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        const token = await AsyncStorage.getItem("accessToken");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setCurrentUserID(parsedUser.userID);
        }
        if (token) {
          setAccessToken(token);
        }
      } catch (err) {
        console.error("Error reading AsyncStorage:", err);
      }
    };
    getUser();
  }, []);

  // Fetch users matching search query
  const fetchUsers = async (searchTerm) => {
    if (!searchTerm) {
      setShowSearch(false);
      setDatabase([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(

        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users/allUsers?search=${searchTerm}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const users = response.data.data.filter(
        (user) => user.userID !== currentUserID
      );
      setDatabase(users);
      setShowSearch(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (text.length >= 1) {
        fetchUsers(text);
      } else {
        setShowSearch(false);
        setDatabase([]);
      }
    }, 500); // 500ms delay, adjust as needed
  };

  const openUserProfile = (item) => {
    router.push({
      pathname: "../pages/OtherProfile",
      params: { userData: JSON.stringify(item) },
    });
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search By UserName"
            value={searchText}
            onChangeText={handleSearchChange}
            placeholderTextColor="#888"
          />
          {loading && <ActivityIndicator size="small" color="#000" style={styles.loading} />}
        </View>

        {/* Search Results */}
        {showSearch ? (
          database.length > 0 ? (
            <FlatList
              data={database}
              keyExtractor={(item) => item.id || item.userID.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openUserProfile(item)}>
                  <View style={styles.messageItem}>
                    <Image
                      source={
                        item.profilePic
                          ? { uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.profilePic}` }
                          : item.userGender == 2
                            ? require("../../assets/images/profile-female.jpg")
                            : require("../../assets/images/profile.jpg")
                      }
                      style={styles.messageAvatar}
                    />
                    <View style={styles.messageContent}>
                      <Text style={styles.messageName}>
                        {item.userFirstName} {item.userSurname}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noResultsText}>No users found.</Text>
          )
        ) : null}
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  loading: {
    marginLeft: 10,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 10,
    marginHorizontal: 10,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
    fontSize: 16,
  },
});