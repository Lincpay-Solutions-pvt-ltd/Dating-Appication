import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import moment from "moment";

const TransactionHistoryScreen = () => {
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [haveMore, setHaveMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      const userData = await AsyncStorage.getItem("User");
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser.userID);
      await fetchTransactions(parsedUser.userID, 1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    };
    fetchData();
  }, []);

  const fetchTransactions = async (userID, pageNumber) => {
    try {
      if (pageNumber === 1) setLoading(true);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/coins/user-transaction/${userID}?page=${pageNumber}&limit=10`
      );

      if (response.data && response.data.status) {
        const newTransactions = response.data.data || [];

        let lastItem = newTransactions[newTransactions.length - 1];
        let hasMore = lastItem?.haveMore || false;
        let total = lastItem?.totalCount || 0;

        const cleanedTransactions = newTransactions.map((item) => {
          const { haveMore, totalCount, ...rest } = item;
          return rest;
        });

        if (pageNumber === 1) {
          setTransactions(cleanedTransactions);
          setTotalCount(total);
        } else {
          setTransactions((prev) => [...prev, ...cleanedTransactions]);
        }

        setHaveMore(hasMore);
      } else {
        setHaveMore(false);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      setHaveMore(false);
    } finally {
      if (pageNumber === 1) setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (loadingMore || !haveMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(userId, nextPage);
  };

  const renderItem = ({ item }) => {
    const isCredit = item.receiverId === userId;
    const coinChange = item.coinCount;
    const senderName = `${item.senderFirstName} ${item.senderSurname}`.trim();
    const receiverName = `${item.receiverFirstName} ${item.receiverSurname}`.trim();

    const fullDate = moment(item.transactionDate).format("DD MMM, YYYY hh:mm A");

    // const timeAgo = moment(item.transactionDate).fromNow();

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={[styles.item, isCredit ? styles.credit : styles.debit]}
          onPress={() =>
            router.push({
              pathname: "./TransactionDetailsScreen",
              params: {
                coinTransactionId: item.coinTransactionId,
                senderId: item.senderId,
                receiverId: item.receiverId,
                transactionDate: item.transactionDate,
                coinCount: item.coinCount,
              },
            })
          }
        >
          <Text style={styles.amount}>
            {isCredit ? '+' : '-'}{coinChange} Coin{coinChange > 1 ? 's' : ''}
          </Text>
          <Text style={styles.date}>{fullDate}</Text>
          <Text style={styles.info}>
            {isCredit ? `From: ${senderName}` : `To: ${receiverName}`}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Transaction History</Text>
          <Text style={styles.totalCoins}>
            Total Transactions: {totalCount}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.coinTransactionId.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noData}>No transactions found.</Text>}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 10 }}>
              <ActivityIndicator size="small" color="#e91e63" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  headerCenter: { alignItems: "center", flex: 1 },
  title: { fontSize: 20, fontWeight: "bold" },
  totalCoins: { fontSize: 16, marginTop: 4 },
  item: { padding: 16, borderRadius: 8, marginBottom: 10, backgroundColor: '#fff', elevation: 2 },
  credit: { borderLeftWidth: 4, borderLeftColor: '#2e7d32' },
  debit: { borderLeftWidth: 4, borderLeftColor: '#c62828' },
  amount: { fontSize: 16, fontWeight: "bold" },
  date: { fontSize: 12, color: "#555", marginTop: 4 },
  info: { fontSize: 14, marginTop: 4, color: '#333' },
  noData: { textAlign: "center", marginTop: 20, color: "#888" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default TransactionHistoryScreen;