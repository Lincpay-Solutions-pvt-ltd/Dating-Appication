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
import { useState, useEffect, useRef, useMemo } from "react";
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const debounceTimeout = useRef(null);
  const router = useRouter();

  useMemo(() => {
    const getUser = async () => {
      const User = await AsyncStorage.getItem("User");
      const Token = await AsyncStorage.getItem("accessToken");

      const parsedUser = JSON.parse(User);
      setCurrentUserID(parsedUser.userID);
      setAccessToken(Token);

      // Simulate followers check; you may replace this with actual logic
      const followingData = []; // Assume no followers
      if (followingData.length === 0) {
        fetchSuggestedUsers(Token, parsedUser.userID);
      }
    };

    getUser();
  }, []);

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
    }, 500);
  };

  const openUserProfile = (item) => {
    router.push({
      pathname: "../pages/OtherProfile",
      params: { userData: JSON.stringify(item) },
    });
  };

  const fetchSuggestedUsers = async (token, currentUserID) => {
    setIsSuggestionsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users/allUsers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allUsers = response.data.data;
      const filtered = allUsers.filter((item) => item.userID !== currentUserID);

      setSuggestedUsers(filtered);
      setShowSuggestions(true);
    } catch (error) {
      console.log("Suggested user fetch error:", error);
    } finally {
      setIsSuggestionsLoading(false);
    }
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
          {loading && (
            <ActivityIndicator
              size="small"
              color="#000"
              style={styles.loading}
            />
          )}
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
                          ? {
                              uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.profilePic}`,
                            }
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

        {/* Suggested Users Section */}
        {showSuggestions &&
          (isSuggestionsLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text>Loading Suggestions...</Text>
            </View>
          ) : suggestedUsers.length > 0 ? (
            <>
              <Text style={styles.textMsg}>Suggested Users</Text>
              <View style={styles.cardContainer}>
                <FlatList
                  data={suggestedUsers}
                  keyExtractor={(item) => item.id?.toString()}
                  numColumns={2}
                  renderItem={({ item }) => (
                    <View>
                      <TouchableOpacity onPress={() => openUserProfile(item)}>
                        <Image
                          source={
                            item.profilePic
                              ? {
                                  uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}${item.profilePic}`,
                                }
                              : item.userGender == 2
                              ? require("../../assets/images/profile-female.jpg")
                              : require("../../assets/images/profile.jpg")
                          }
                          style={styles.cardImage}
                        />
                        <Text style={styles.messageName} numberOfLines={1}>
                          {/* {item.userFirstName} {item.userSurname} */}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </>
          ) : null)}
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
  textMsg: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 30,
    color: "#000",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  card: {
    width: width / 2 - 10,
    marginBottom: 15,
    alignItems: "center",
    borderRadius: 30,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 100, // Half of width/height for perfect circle
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    margin: 15, // Optional for fallback
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});
