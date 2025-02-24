import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../Redux/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

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
    setError("");
    await login_(email, password);
  };
  const login_ = async (email, password) => {
    if (email === "testing@dev.com" && password === "testing@dev.com") {
      await AsyncStorage.setItem("Authenticated", "true");
      await AsyncStorage.setItem(
        "User",
        JSON.stringify({ name: "John Doe", email: email })
      );
      Alert.alert("Login Successful!", `Welcome, ${email}`);
      dispatch(login({ name: "John Doe", email: email }));
      router.replace("./home");
    } else {
      Alert.alert("Login Failed", "Invalid email or password");
    }
    setIsValidating(false);
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError("");
        }}
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Login Button */}
      {
        isValidating ? (
          <Text>Validating...</Text>
        ) : (
          <TouchableOpacity style={styles.button} onPress={validateLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )
      }

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* <Ionicons name="logo-google" size={40} color="red"/> */}
      <View style={styles.loginButton}>
        <TouchableOpacity>
          <Image
            style={styles.image}
            source={require("../../assets/images/facebook.png")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.image}
            source={require("../../assets/images/google.png")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.image}
            source={require("../../assets/images/twitter.png")}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotText: {
    marginTop: 10,
    color: "blue",
  },
  image: {
    top: 30,
    width: 50,
    height: 50,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
    justifyContent: "space-between",
  },
});
