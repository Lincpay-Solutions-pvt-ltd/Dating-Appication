import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../components/header";
import VideoList from "../components/videoCards";


export default function FollowingScreen() {
    return (
        <>
            <View>
                <Header />
            </View>
            <ScrollView>
                <View>
                    <View style={styles.containerTop}>
                        <MaterialIcon style={styles.icon} name="thumb-up" size={24} color="#000" />
                        <Text style={styles.text} >No one you're following is live</Text>
                        {/* <Button title="Go Back" onPress={() => router.back()} /> */}
                    </View>

                    <View style={styles.containerMid}>
                        <Text style={styles.text} >
                            You may also like
                        </Text>
                    </View>
                    <View>
                        <VideoList />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.containerFloat}>
                <Image
                    style={styles.image}
                    source={require("../../assets/images/video-camera.png")}
                ></Image>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    containerTop: {
        display: "flex",
        alignItems: "center",
    },
    containerMid: {
        display: "flex",
        justifyContent: "center",
        alignItems: "left",
        padding: 20
    },
    icon: {
        justifyContent: "center",
        alignItems: "center",
        fontSize: 100,
        padding: 30,
        paddingBottom: 20
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        color: "#000"
    },
    containerFloat: {
        position: "absolute",
        bottom: 50,
        left:"50%",
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
        
    },
    image: {
        justifyContent: "center",
        width: 70,
        height: 70,
    },
}
);


