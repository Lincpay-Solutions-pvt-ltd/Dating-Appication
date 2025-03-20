import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, DatePicker } from "react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SignUpScreen() {
  const router = useRouter(); // Expo Router hook for navigation
  const [userFirstName, setFirstName] = useState(null);
  const [userSurname, setSurname] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userPassword, setUserPassword] = useState(null);
  const [userConfirmPassword, setUserConfirmPassword] = useState(null);
  const [userDateOfBirth, setUserDateOfBirth] = useState(null);
  const [userGenderID, setUserGenderID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState(null);

  const [userAccountApproved, setUserAccountApproved] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

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

  const handleSignUp = async () => {
    console.log(userFirstName, userSurname, userEmail, userPassword, userConfirmPassword);

    setIsValidating(true);
    if (!userFirstName || !userSurname || !userEmail || !userPassword || !userConfirmPassword) {
      setError("All fields are required");
      setIsValidating(false);
      return;
    }
    if (!userEmail.includes("@")) {
      setError("Invalid email address");
      setIsValidating(false);
      return;
    } else if (userPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setIsValidating(false);
      return;
    } else if (userPassword !== userConfirmPassword) {
      setError("Passwords do not match");
      setIsValidating(false);
      return;
    } else {
      setError("");
      setLoading(true);
    }
    console.log(err);
    try {
      let data = JSON.stringify({
        userFirstName: userFirstName,
        userSurname: userSurname,
        userEmail: userEmail,
        userPassword: userPassword,
        userDateOfBirth: userDateOfBirth,
        userGenderID: userGenderID,
        userRoleID: 1,
        userAccountApproved: 1,
      });
      await axios.post('http://192.168.0.100:5000/api/v1/users/signup', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(async function (response) {
        console.log(response.data);
        console.log("response-content", response.data.content);
        if (response.data.status === true) {
          Alert.alert("Sign Up Successfull", "please waitwhile logging in");
          console.log("\n", userEmail, userPassword, "\n");
          
          await login_(userEmail, userPassword);
        }


      }).catch(function (error) {
        console.log("error-", error);
        Alert.alert("Sign Up Failed", error.toString());
        setIsValidating(false);
      })
    } catch (err) {
      console.log("Cache", err);
    }
    setIsValidating(false);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={userFirstName}
          onChangeText={(text) => setFirstName(text)}
        />


        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={userSurname}
          onChangeText={(text) => setSurname(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={userEmail}
          onChangeText={(text) => setUserEmail(text)}
        />



        {/* Password Input */}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={userPassword}
          onChangeText={(text) => setUserPassword(text)}
        />


        {/* Confirm Password Input */}

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={userConfirmPassword}
          onChangeText={(text) => setUserConfirmPassword(text)}
        />

        {/* Err Text */}

        {err && <Text style={styles.errorText}>{err}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
        </TouchableOpacity>

        {/* Navigate to Login */}
        <Text style={styles.loginText} onPress={() => router.push("../pages/login")}>
          Already have an account?

          <Text style={styles.loginLink}>Log in</Text>
        </Text>



      </View>
    </View>
  )
}
// Styles
const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    // backgroundColor: "black",
  },
  formBox: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "gray",
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  err: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#000",
    borderColor: "#fff",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  }
});
