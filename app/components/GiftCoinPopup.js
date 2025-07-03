import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications'; // make sure you wrap your app with ToastProvider

const GiftCoinPopup = ({ visible, onClose, receiverId }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const coinOptions = [3, 5, 10, 20, 30, 50];

  useEffect(() => {
  if (visible) {
    setSelectedAmount(null); 
  }
}, [visible]);

  const handleSend = async () => {
    if (!selectedAmount) return;

    try {
      setLoading(true);

      if (selectedAmount <= 0) {
        toast.show('Please select a valid coin amount', {
          type: 'danger',
          placement: 'top',
        });
        return;
      }

      const user = await AsyncStorage.getItem("User");
      if (!user) {
        toast.show('User session expired', {
          type: 'danger',
          placement: 'top',
        });
        return;
      }

      const senderId = JSON.parse(user).userID;

      if (senderId === receiverId) {
        toast.show('Cannot send coins to yourself', {
          type: 'danger',
          placement: 'top',
        });
        return;
      }

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/coins/send-coin`,
        {
          senderId,
          receiverId,
          count: selectedAmount,
        },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.status) {
        toast.show(`${selectedAmount} coins sent successfully!`, {
          type: 'success',
          placement: 'top',
        });
        setSelectedAmount(null);
        onClose();
      } else {
        throw new Error(response.data.msg || "Failed to send coins");
      }

    } catch (error) {
      console.error("Error sending coins:", error);

      let errorMessage = "Failed to send coins";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || "Invalid request";
            break;
          case 401:
            errorMessage = "Session expired - please login again";
            break;
          case 403:
            errorMessage = "Not enough coins to send";
            break;
          case 404:
            errorMessage = "Recipient not found";
            break;
          case 500:
            errorMessage = "Server error - please try again later";
            break;
          default:
            errorMessage = error.response.data?.message || "Request failed";
        }
      } else if (error.request) {
        errorMessage = "Network error - please check your connection";
      } else if (error.message.includes('timeout')) {
        errorMessage = "Request timed out - please try again";
      }

      toast.show(errorMessage, {
        type: 'danger',
        placement: 'top',
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <Text style={styles.title}>Send Gift Coins</Text>
          <Text style={styles.subtitle}>Select coin amount</Text>

          <View style={styles.coinOptions}>
            {coinOptions.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.coinButton,
                  selectedAmount === amount && styles.selectedCoinButton,
                ]}
                onPress={() => setSelectedAmount(amount)}
              >
                <Text style={styles.coinText}>{amount} coins</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sendButton,
                !selectedAmount && styles.disabledButton,
              ]}
              onPress={handleSend}
              disabled={!selectedAmount || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Gift</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  coinOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  coinButton: {
    width: '30%',
    padding: 8,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedCoinButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fe2146',
  },
  coinText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#fe2146',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
    borderColor: '#fe2146',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GiftCoinPopup;
