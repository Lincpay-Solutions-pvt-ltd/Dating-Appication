import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import FontistoIcons from 'react-native-vector-icons/Fontisto';

export default function SignUpScreen() {
  const router = useRouter();
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

    await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users/login`, data, {
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
      await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users/signup`, data, {
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
            <Text style={styles.title}>Create Account</Text>
            {/* <Text style={styles.subtitle}>Join us and start your journey</Text> */}
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#9ca3af"
              value={userFirstName}
              onChangeText={(text) => setFirstName(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Surname"
              placeholderTextColor="#9ca3af"
              value={userSurname}
              onChangeText={(text) => setSurname(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              value={userEmail}
              onChangeText={(text) => setUserEmail(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={userPassword}
              onChangeText={(text) => setUserPassword(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={userConfirmPassword}
              onChangeText={(text) => setUserConfirmPassword(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Date of Birth (DD-MM-YYYY)"
              placeholderTextColor="#9ca3af"
              value={userDateOfBirth}
              onChangeText={(text) => setUserDateOfBirth(text)}
            />

            {/* Gender Selection */}
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    userGenderID === 1 && styles.genderButtonSelected
                  ]}
                  onPress={() => setUserGenderID(1)}
                >
                  <Text style={[
                    styles.genderButtonText,
                    userGenderID === 1 && styles.genderButtonTextSelected
                  ]}>
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    userGenderID === 2 && styles.genderButtonSelected
                  ]}
                  onPress={() => setUserGenderID(2)}
                >
                  <Text style={[
                    styles.genderButtonText,
                    userGenderID === 2 && styles.genderButtonTextSelected
                  ]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {err && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{err}</Text>
              </View>
            )}

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[styles.signUpButton, (loading || isValidating) && styles.signUpButtonDisabled]} 
              onPress={handleSignUp} 
              disabled={loading || isValidating}
            >
              <LinearGradient
                colors={['#f472b6', '#ec4899']}
                style={styles.buttonGradient}
              >
                <Text style={styles.signUpButtonText}>
                  {loading || isValidating ? "Signing Up..." : "Sign Up"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("../pages/login")}>
                <Text style={styles.loginLink}>Log in</Text>
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
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: 32,
    color: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
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
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: '#fce7f3',
    borderRadius: 28,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#374151',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  genderContainer: {
    marginVertical: 8,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#fce7f3',
    backgroundColor: '#ffffff',
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
  genderButtonSelected: {
    backgroundColor: '#f472b6',
    borderColor: '#f472b6',
    shadowColor: '#f472b6',
    shadowOpacity: 0.3,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  genderButtonTextSelected: {
    color: '#ffffff',
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
  signUpButton: {
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
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 16,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 16,
    color: '#f472b6',
    fontWeight: '600',
  },
});