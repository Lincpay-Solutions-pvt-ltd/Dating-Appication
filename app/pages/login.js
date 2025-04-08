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
import axios from 'axios';

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
    let data = JSON.stringify({
      "userEmail": email,
      "userPassword": password
    });

    await axios.post('http://192.168.0.100:5000/api/v1/users/login', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async function (response) {
      console.log(response.data);
      if (response.data.status === true) {
        console.log("\n", response.data.data.UserData, "\n");
        await AsyncStorage.setItem("Authenticated", "true");
        await AsyncStorage.setItem("accessToken", JSON.stringify(response.data.data.accessToken));
        await AsyncStorage.setItem("refreshToken", JSON.stringify(response.data.data.refreshToken));
        await AsyncStorage.setItem(
          "User",
          JSON.stringify(response.data.data.UserData)
        );
        router.replace("./home");
      }
      else {
        Alert.alert("Login Failed", "Invalid email or password");
      }
      setIsValidating(false);
    }).catch(function (error) {
      console.log(error);
      setIsValidating(false);
    })
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign-In</Text>

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
      <View style={styles.forgotContainer}>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
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


        {/* Sign Up Button */}
      </View>
      <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("./signUp")}>
        <Text>Can't login ? , </Text><Text style = {styles.signUpButtonText}> Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 30,
    marginBottom: 10,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
  eyeIcon: {
    padding: 10,
    color: "white",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 20,
    width: "100%",
    borderRadius: 30,
    borderColor: "white",
    alignItems: "center",
    width: "100%",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 30,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  forgotContainer:{
    padding:10
  },
  forgotText: {
    marginTop: 10,
    fontSize: 20,
    left:80,
    color: "#000",
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
  signUpButton: {
    padding: 10,
    color: "black",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    top: 40,
    left: 30,
    marginTop: 30,
    justifyContent: "space-between",
  },
  signUpButtonText: {
    color: "red",
    fontFamily: "courier",
    fontSize: 20,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  }
});
