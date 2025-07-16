import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../Redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6BrandsIcons from "react-native-vector-icons/FontAwesome6";
import FontistoIcons from 'react-native-vector-icons/Fontisto';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("testing@dev.com");
  const [password, setPassword] = useState("testing@dev.com");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const validateLogin = async () => {
    setIsValidating(true);
    if (!email.includes("@")) {
      setError("Invalid email address");
      setIsValidating(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsValidating(false);
      return;
    }
    try {
      await login_(email, password);
    } catch (err) {
      //  console.error("Something is wrong = ", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const login_ = async (userEmail, userPassword) => {
    //here data means what value the user is passing
    let data = JSON.stringify({
      userEmail: userEmail,
      userPassword: userPassword,
    });
    console.log("Login data = ", data);

    await axios
      .post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async function (response) {
        if (response.data.status === true) {
          await AsyncStorage.setItem("Authenticated", "true");
          await AsyncStorage.setItem(
            "accessToken",
            response.data.data.accessToken
          );
          await AsyncStorage.setItem(
            "refreshToken",
            JSON.stringify(response.data.data.refreshToken)
          );
          await AsyncStorage.setItem(
            "User",
            JSON.stringify(response.data.data.UserData)
          );
          console.log("REDIXUSer = ", { user: response.data.data.UserData, isAuthenticated: true });

          dispatch(login(response.data.data.UserData)); // Enable this if you're using Redux state
          router.replace("./home");

        }
        setIsValidating(false);
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          setError(error.response.data.msg);
        }
        console.log("Error = ", error.response);
        setIsValidating(false);
      });
  };

  /*Forgot password implementation via api*/
  const forgotPassword = async () => {
    //console.log("OTP sent to your number");
  }

  return (
    <LinearGradient
      colors={['#fdf2f8', '#ffffff', '#fef7ed']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formBox}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontistoIcons name="person" size={40} color="#fff" />
            </View>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Please login to continue </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#f472b6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="key" size={20} color="#f472b6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isValidating && styles.loginButtonDisabled]}
              onPress={validateLogin}
              disabled={isValidating}
            >
              <LinearGradient
                colors={['#f472b6', '#ec4899']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isValidating ? "Signing In..." : "Sign In"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => router.push("../pages/forgotPassword")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={30} color="#ea4335" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={30} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome6BrandsIcons name="x-twitter" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("./signUp")}>
                <Text style={styles.signUpLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  formBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f472b6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#f472b6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 2,
    borderColor: '#fce7f3',
    borderRadius: 28,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#f472b6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  forgotText: {
    fontSize: 16,
    color: '#f472b6',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 26,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#6b7280',
  },
  signUpLink: {
    fontSize: 16,
    color: '#f472b6',
    fontWeight: '600',
  },
});