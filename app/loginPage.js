import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Button } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileScreen from "./main/profile";
import { replace } from "expo-router/build/global-state/routing";
import { replacePart } from "expo-router/build/fork/getStateFromPath-forks";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from 'react-redux';
import { login2, logout2 } from '../Redux/authSlice';

export default function LoginScreen() {
  const [email, setEmail] = useState("testing@dev.com");
  const [password, setPassword] = useState("testing@dev.com");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);


  const validateAndLogin = () => {
    if (!email.includes("@")) {
      setError("Invalid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    login(email, password);
  };
  const login = (email, password) => {
    // Perform login logic here
    if (email === "testing@dev.com" && password === "testing@dev.com") {
      Alert.alert("Login Successful!", `Welcome, ${email}`);
      // router.replace("main/profile");
      dispatch(login2({ name: 'John Doe', email: email }));
    }
    else {
      Alert.alert("Login Failed", "Invalid email or password");
    }
    // Return a boolean value indicating whether the login was successful
    return true;
  };

  const facebookLogin = () => {
    // Perform Facebook login logic here
    // Return a boolean value indicating whether the login was successful
    return true;
    
  };
  return (
    <>
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
        <TouchableOpacity style={styles.button} onPress={validateAndLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* <Ionicons name="logo-google" size={40} color="red"/> */}
        <View style={styles.loginButton}>
          <TouchableOpacity >
            <Image style={styles.image} source={require("../assets/images/facebook.png")}></Image>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={styles.image} source={require("../assets/images/google.png")}></Image>
          </TouchableOpacity>
          <TouchableOpacity >
            <Image style={styles.image} source={require("../assets/images/twitter.png")}></Image>
          </TouchableOpacity>
        </View>
      </View>
    </>
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
    height: 50
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
    justifyContent: "space-between"
  },
});
