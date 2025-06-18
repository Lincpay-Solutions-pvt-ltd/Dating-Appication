import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const API_BASE_URL = 'https://58f7-182-70-116-29.ngrok-free.app/api/v1';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toastRef = React.useRef();
  const router = useRouter();

  const handleSendOTP = async () => {
    if (!email.trim()) {
      toastRef.current?.show('Email is required', { type: 'danger' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/forgot-password`, {
        userEmail: email
      });

      if (response.data?.status) {
        toastRef.current?.show(response.data.msg || 'OTP sent successfully', { type: 'success' });

        setTimeout(() => {
          router.push(`./otpScreen?userID=${response.data.userID}`);
        }, 1500);
      } else {
        toastRef.current?.show(response.data?.msg || 'Failed to send OTP', { type: 'danger' });
      }
    } catch (error) {
      console.error('OTP Error:', error);
      toastRef.current?.show(
        error.response?.data?.msg || 'Server error. Please try again.',
        { type: 'danger' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Toast ref={toastRef} placement="top" />

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email address to receive an OTP.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSendOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
