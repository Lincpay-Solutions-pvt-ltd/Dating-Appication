import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransactionDetailsScreen = () => {
  const router = useRouter();
  const { receiverId } = useLocalSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await AsyncStorage.getItem("User");
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser.userID);
      await fetchDetails(parsedUser.userID);
    };
    fetchData();
  }, []);

  const fetchDetails = async (loggedInUserId) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/coins/user-transaction/${receiverId}`
      );
      if (response.data && response.data.status) {
        const rawData = response.data.data;

        let given = 0;
        let received = 0;

        rawData.forEach((item) => {
          if (item.senderId === loggedInUserId) {
            given += item.coinCount;
          } else if (item.receiverId === loggedInUserId) {
            received += item.coinCount;
          }
        });

        const groupedData = [
          { label: "You Transferred", amount: given, color: "#c62828" },
          { label: "You Received", amount: received, color: "#2e7d32" },
        ];

        setTransactions(groupedData);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.detailItem, { borderLeftColor: item.color }]}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={[styles.amount, { color: item.color }]}>
        {item.amount} Coins
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* List */}
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.noData}>No transactions found.</Text>
        }
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },

  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    minWidth: 120,
  },
  noData: {
    textAlign: "center",
    marginTop: 30,
    color: "#999",
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TransactionDetailsScreen;
