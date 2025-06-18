import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button } from "react-native";
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
  const [userGenderID, setUserGenderID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState(null);
  const [userAccountApproved, setUserAccountApproved] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const [userDateOfBirth, setUserDateOfBirth] = useState('');

  const login_ = async (email, password) => {
    let data = JSON.stringify({
      "userEmail": email,
      "userPassword": password
    });

    await axios.post('http://192.168.0.101:5000/api/v1/users/login', data, {
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
    }
    else if (userDateOfBirth == null) {
      setError("Enter proper date");
      setIsValidating(false);
      return;
    }

    else {
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
      await axios.post('http://192.168.0.101:5000/api/v1/users/signup', data, {
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


        {/* date of birth with DD-MM-YYYY input in a text*/}
        <TextInput
          style={styles.input}
          placeholder="Enter DD-MM-YYYY"
          secureTextEntry
          value={userDateOfBirth}
          onChangeText={(text) => setUserDateOfBirth(text)}
        />

        {/* gender choose by radio button*/}

        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>Gender:</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={userGenderID == 1 ? styles.radioItemChecked : styles.radioItem}
              onPress={() => setUserGenderID(1)}
            >
              <Text style={userGenderID == 1 ? styles.radioTextChecked : styles.radioText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={userGenderID == 2 ? styles.radioItemChecked : styles.radioItem}
              onPress={() => setUserGenderID(2)}
            >
              <Text style={userGenderID == 2 ? styles.radioTextChecked : styles.radioText}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>



        {/* Err Text */}

        {err && <Text style={styles.errorText}>{err}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
        </TouchableOpacity>

        {/* Navigate to Login */}
        <Text style={styles.loginText} onPress={() => router.push("../pages/login")}>
          Already have an account?

          <Text style={styles.loginLink}> Log in</Text>
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
    alignSelf: "flex-start",
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#f8768e",
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
    backgroundColor: "#f8768e",
    borderColor: "black",
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
    fontSize: 20,
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
    right: 10,
    fontSize: 22,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    right: 50
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#333",
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#f8768e",
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#FFF",
  },
  radioItemChecked: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#f8768e",
  },
  radioText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  radioTextChecked: {
    color: "white", // selected text color
    fontSize: 16,
    textAlign: "center",
  },
  dateContainer: {
    margin: 20
  },
  dateInput: {
    borderWidth: 1,
    borderColor: 'lightgray',
    fontSize: 16,
    marginBottom: 10,
    borderRadius: 10
  },
  dateText: {
    fontSize: 15,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 0,
    right: 50
  },

});
