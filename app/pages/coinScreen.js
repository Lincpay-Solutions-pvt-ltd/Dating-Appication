import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { requestRefresh, updateFromTransaction } from "../Redux/coinSlice";

const CoinScreen = () => {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentURL, setPaymentURL] = useState(null);
  const [user, setUser] = useState({});
  const [processing, setProcessing] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get coins from Redux store instead of local state
  const totalCoins = useSelector((state) => state.coins?.total ?? 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem("User");
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        await fetchOffers();
        
        // Trigger initial refresh of coins through Redux
        if (parsedUser?.userID) {
          dispatch(requestRefresh());
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        Alert.alert("Error", "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/coins/all-offers`
      );
      if (response.data?.status) {
        setOffers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const handlePurchase = async (offer) => {
    try {
      setProcessing(true);
      setSelectedOffer(offer.offerId);

      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        Alert.alert("Login Required", "Please login first.");
        router.push("../login");
        return;
      }

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/coins/purchase-coin`,
        {
          userID: user.userID,
          count: offer.coinAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.status) {
        toast.show(`✅ Purchased ${offer.coinAmount} coins!`, { type: "success" });
        
        // Update balance immediately if API returns new balance
        if (response.data.updatedBalance !== undefined) {
          dispatch(updateFromTransaction(response.data.updatedBalance));
        } else {
          // Fallback to refresh if no balance in response
          dispatch(requestRefresh());
        }
        
        setShowSuccessModal(true);
      } else {
        toast.show(`❌ ${response.data?.msg || "Purchase failed"}`, { type: "danger" });
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.show(`❌ ${error.response?.data?.msg || "Something went wrong"}`, {
        type: "danger",
      });
    } finally {
      setProcessing(false);
      setSelectedOffer(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coins</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <View style={styles.balanceRow}>
          <Image style={styles.coinIcon} source={require("../../assets/images/coin.png")} />
          <Text style={styles.coinBalance}>{totalCoins}</Text>
        </View>
      </View>

      <View style={styles.balanceContainer}>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push("../components/TransactionHistoryScreen")}
        >
          <Text style={styles.historyButtonText}>View Transaction History</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Available Packages</Text>

      {offers.length === 0 ? (
        <View style={styles.noOffersContainer}>
          <Text style={styles.noOffersText}>
            No coin packages available at the moment. Please check back later.
          </Text>
        </View>
      ) : (
        <View style={styles.offerGrid}>
          {offers.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.offerCard,
                selectedOffer === item.offerId && styles.selectedOffer,
              ]}
              onPress={() => handlePurchase(item)}
              disabled={processing}
            >
              <Text style={styles.offerCoins}>{item.coinAmount} Coins</Text>
              <Text style={styles.offerPrice}>₹ {item.offerPrice}</Text>
              <Text style={styles.oldPrice}>₹ {item.actualPrice}</Text>
              {processing && selectedOffer === item.offerId && (
                <ActivityIndicator size="small" color="#e91e63" style={{ marginTop: 10 }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {paymentURL && (
        <>
          <WebView
            source={{ uri: paymentURL }}
            style={{ height: 400, width: "100%" }}
            startInLoadingState={true}
            mediaPlaybackRequiresUserAction={false}
          />
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Payment URL: {paymentURL}
          </Text>
        </>
      )}

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🎉 Purchase Successful!</Text>
            <TouchableOpacity
              onPress={() => setShowSuccessModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 9px rgba(0,0,0,0.06)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  balanceContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 20,
    color: "#000",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  coinIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  coinBalance: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#e91e63",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  offerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    padding: 20,
    padding: 20,  
    justifyContent: "space-around",
  },
  offerCard: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    boxShadow: "0px 2px 9px rgba(0,0,0,0.06)",
  },
  selectedOffer: {
    borderWidth: 2,
    borderColor: "#e91e63",
  },
  offerCoins: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e91e63",
  },
  oldPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginTop: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "75%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#e91e63",
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '75%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOffersContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noOffersText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
historyButton: {
  backgroundColor: '#e91e63',
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 10,
  width: '70%',
  alignItems: 'center',
  marginTop: 20, 
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3, // for Android shadow
},

historyButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});


export default CoinScreen;
