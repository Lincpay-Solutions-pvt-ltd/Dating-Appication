import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import axios from "axios";

const CoinsScreen = () => {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(19 * 60 + 12);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await AsyncStorage.getItem("User");
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        await Promise.all([
          fetchOffers(),
          fetchUserCoins(parsedUser?.userID)
        ]);
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/coins/all-offers`);
      if (response.data?.status && response.data?.data) {
        setOffers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      throw error;
    }
  };

  const fetchUserCoins = async (userID) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/coins/user-total-coin/${userID}`
      );
      if (response.data?.status) {
        const coins = response.data.data || [];
        const totalCount = coins.length > 0 ? coins[coins.length - 1].totalCount : 0;
        setUserCoins(totalCount);
      }
    } catch (error) {
      console.error("Error fetching user coins:", error);
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" style={styles.backIcon} size={28} color="white" />
          </TouchableOpacity>
          <Image style={styles.coinImage} source={require("../../assets/images/coin.png")} />
             <View style={styles.container}>
            <View style={styles.coinsContainer}>
              <Text style={styles.coinsText}>{userCoins}</Text>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Best Offers</Text>
            <View style={styles.offerGrid}>
              {offers.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.offerCard}
                  onPress={() =>
                    router.push({
                      pathname: "./purchaseCoin",
                      params: {
                        coinAmount: item.coinAmount,
                        offerPrice: item.offerPrice,
                        actualPrice: item.actualPrice,
                        offerId: item.offerId,
                      },
                    })
                  }
                >
                  <Text style={styles.coinText}>
                    <Image style={styles.coinImage} source={require("../../assets/images/coin.png")} />{" "}
                    {item.coinAmount}
                  </Text>
                  <Image style={styles.amountPic} source={require("../../assets/images/coins_4.png")} />
                  <Text style={styles.price}>{item.offerPrice}</Text>
                  <Text style={styles.oldPrice}>{item.actualPrice}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#000",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    backIcon: {
        marginRight: 8,
    },
    coinImage: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    coinsText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    amountPic: {
        left: 40,
        width: 80,
        height: 80,
        padding: 8,
       },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        color: "white",
    },
    offerGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    offerCard: {
        width: "48%",
        marginBottom: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 8,
    },
    moreOfferContainer: {
        marginTop: 16,
    },
    moreOfferCard: {
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 8,
        padding: 16,
    },
    moreOfferText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "white",
    },
    coinText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "white",
    },
    price: {
        fontSize: 16,
        left: 40,
        fontWeight: "bold",
        color: "white",
    },
    oldPrice: {
        fontSize: 16,
        left: 40,
        color: "red",
        textDecorationLine: "line-through",
    },
});

export default CoinsScreen;