import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import FontistoIcons from "react-native-vector-icons/Fontisto";
import { Ionicons } from "@expo/vector-icons";

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
  const [isValidating, setIsValidating] = useState(false);
  const [userDateOfBirth, setUserDateOfBirth] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (selectedDay && selectedMonth !== null && selectedYear) {
      const formattedDate = `${("0" + selectedDay).slice(-2)}-${(
        "0" +
        (selectedMonth + 1)
      ).slice(-2)}-${selectedYear}`;
      setUserDateOfBirth(formattedDate);
    }
  }, [selectedDay, selectedMonth, selectedYear]);
  const handleSignUp = async () => {
    setIsValidating(true);
    if (
      !userFirstName ||
      !userSurname ||
      !userEmail ||
      !userPassword ||
      !userConfirmPassword
    ) {
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
    } else if (!userDateOfBirth) {
      setError("Enter proper date");
      setIsValidating(false);
      return;
    } else {
      setError("");
      setLoading(true);
    }

    try {
      let data = JSON.stringify({
        userFirstName,
        userSurname,
        userEmail,
        userPassword,
        userDateOfBirth,
        userGenderID,
        userRoleID: 1,
        userAccountApproved: 1,
      });

      await axios
        .post(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users/signup`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (response) => {
          if (response.data.status === true) {
            Alert.alert("Sign Up Successful", "please wait while logging in");
            await login_(userEmail, userPassword);
          }
        })
        .catch((error) => {
          Alert.alert("Sign Up Failed", error.toString());
          setIsValidating(false);
        });
    } catch (err) {
      console.log("Cache", err);
    }
    setIsValidating(false);
    setLoading(false);
  };

  const login_ = async (email, password) => {
    let data = JSON.stringify({ userEmail: email, userPassword: password });

    await axios
      .post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(async (response) => {
        if (response.data.status === true) {
          await AsyncStorage.setItem("Authenticated", "true");
          await AsyncStorage.setItem(
            "accessToken",
            JSON.stringify(response.data.data.accessToken)
          );
          await AsyncStorage.setItem(
            "refreshToken",
            JSON.stringify(response.data.data.refreshToken)
          );
          await AsyncStorage.setItem(
            "User",
            JSON.stringify(response.data.data.UserData)
          );
          router.replace("./home");
        } else {
          Alert.alert("Login Failed", "Invalid email or password");
        }
        setIsValidating(false);
      })
      .catch((error) => {
        console.log(error);
        setIsValidating(false);
      });
  };

  return (
    <LinearGradient
      colors={["#fdf2f8", "#ffffff", "#fef7ed"]}
      style={styles.container}
    >
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formBox}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontistoIcons name="person" size={28} color="#fff" />
            </View>
            <Text style={styles.title}>Create Account</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#9ca3af"
              value={userFirstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Surname"
              placeholderTextColor="#9ca3af"
              value={userSurname}
              onChangeText={setSurname}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              value={userEmail}
              onChangeText={setUserEmail}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={userPassword}
                onChangeText={setUserPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showConfirmPassword}
                value={userConfirmPassword}
                onChangeText={setUserConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setShowCalendar(true)}>
              <View pointerEvents="none">
                <TextInput
                  style={styles.input}
                  placeholder="Date of Birth (DD-MM-YYYY)"
                  placeholderTextColor="#9ca3af"
                  value={userDateOfBirth}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    userGenderID === 1 && styles.genderButtonSelected,
                  ]}
                  onPress={() => setUserGenderID(1)}
                >
                  <Ionicons
                    name="male"
                    size={30}
                    color={userGenderID === 1 ? "#fff" : "#000"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    userGenderID === 2 && styles.genderButtonSelected,
                  ]}
                  onPress={() => setUserGenderID(2)}
                >
                  <Ionicons
                    name="female"
                    size={30}
                    color={userGenderID === 2 ? "#fff" : "#000"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {err && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{err}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.signUpButton,
                (loading || isValidating) && styles.signUpButtonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading || isValidating}
            >
              <LinearGradient
                colors={["#f472b6", "#ec4899"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.signUpButtonText}>
                  {loading || isValidating ? "Signing Up..." : "Sign Up"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("../pages/login")}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.calendarContainer}>
              {/* Header with gradient */}
              <LinearGradient
                colors={["#f472b6", "#f472b6"]}
                style={styles.modalHeader}
              >
                <Text style={styles.modalTitle}>Select Date of Birth</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCalendar(false)}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </LinearGradient>

              {/* Month Selector */}
              <View style={styles.selectorSection}>
                <Text style={styles.selectorLabel}>Month</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.scrollItem,
                        selectedMonth === i && styles.selectedScrollItem,
                      ]}
                      onPress={() => setSelectedMonth(i)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={
                          selectedMonth === i
                            ? ["#f472b6", "#f472b6"]
                            : ["#f5f5f5", "#f5f5f5"]
                        }
                        style={styles.scrollItemGradient}
                      >
                        <Text
                          style={
                            selectedMonth === i
                              ? styles.selectedScrollText
                              : styles.scrollText
                          }
                        >
                          {new Date(0, i).toLocaleString("default", {
                            month: "short",
                          })}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Year Selector */}
              <View style={styles.selectorSection}>
                <Text style={styles.selectorLabel}>Year</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {Array.from({ length: 100 }).map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.scrollItem,
                          selectedYear === year && styles.selectedScrollItem,
                        ]}
                        onPress={() => setSelectedYear(year)}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={
                            selectedYear === year
                              ? ["#f472b6", "#f472b6"]
                              : ["#f5f5f5", "#f5f5f5"]
                          }
                          style={styles.scrollItemGradient}
                        >
                          <Text
                            style={
                              selectedYear === year
                                ? styles.selectedScrollText
                                : styles.scrollText
                            }
                          >
                            {year}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Day Grid */}
              <View style={styles.daySection}>
                <Text style={styles.selectorLabel}>Day</Text>
                <View style={styles.calendarGrid}>
                  {Array.from({
                    length: new Date(
                      selectedYear,
                      selectedMonth + 1,
                      0
                    ).getDate(),
                  }).map((_, i) => {
                    const day = i + 1;
                    return (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.dayButton,
                          selectedDay === day && styles.daySelected,
                        ]}
                        onPress={() => setSelectedDay(day)}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={
                            selectedDay === day
                              ? ["#f472b6", "#f472b6"]
                              : ["#f0f0f0", "#fafafa"]
                          }
                          style={styles.dayButtonGradient}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              selectedDay === day && styles.selectedDayText,
                            ]}
                          >
                            {day}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Done Button */}
              <TouchableOpacity
                style={styles.modalDoneBtn}
                onPress={() => setShowCalendar(false)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#f472b6", "#f472b6"]}
                  style={styles.doneButtonGradient}
                >
                  <Text style={styles.modalDoneBtnText}>Done</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 1,
  },
  formBox: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 5,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 32,
    backgroundColor: "#f472b6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#fff",
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
    color: "white",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  formContainer: {
    gap: 14,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: "#fce7f3",
    borderRadius: 28,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#374151",
    shadowColor: "#000",
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
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#fce7f3",
    backgroundColor: "#ffffff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  genderButtonSelected: {
    backgroundColor: "#f472b6",
    borderColor: "#f472b6",
    shadowColor: "#f472b6",
    shadowOpacity: 0.3,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  genderButtonTextSelected: {
    color: "#ffffff",
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  signUpButton: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#f472b6",
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
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 16,
    color: "#6b7280",
  },
  loginLink: {
    fontSize: 20,
    color: "#f472b6",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  calendarContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
  selectorSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  scrollRow: {
    height: 50,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  scrollItem: {
    marginHorizontal: 4,
    borderRadius: 25,
    overflow: "hidden",
  },
  scrollItemGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 60,
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedScrollItem: {
    transform: [{ scale: 1.05 }],
    shadowColor: "#f472b6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  selectedScrollText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  daySection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  dayButton: {
    width: "13%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 8,
  },
  dayButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  daySelected: {
    transform: [{ scale: 1.1 }],
    shadowColor: "#f472b6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  selectedDayText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  modalDoneBtn: {
    margin: 20,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#f472b6",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  doneButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  modalDoneBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 2,
    borderColor: "#fce7f3",
    borderRadius: 28,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#374151",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10, // ensure text doesn't collide with the icon
    color: "#111827",
  },
});
