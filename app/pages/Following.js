import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, FlatList } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from '../components/footer';



export default function FollowingScreen() {
    const [videos, setVideos] = useState([]);
    const [msg, setMsg] = useState("loading...");

    useEffect(() => {
        const fetchVideos = async () => {
            setVideos([
                { id: "1", title: "Product 1", price: "Rs. 100" },
                { id: "2", title: "Product 2", price: "Rs. 200" },
                { id: "3", title: "Product 3", price: "Rs. 300" },
                { id: "4", title: "Product 4", price: "Rs. 400" },
                { id: "5", title: "Product 5", price: "Rs. 500" },
                { id: "6", title: "Product 6", price: "Rs. 600" },
                { id: "7", title: "Product 7", price: "Rs. 700" },
                { id: "8", title: "Product 8", price: "Rs. 800" },
                { id: "9", title: "Product 9", price: "Rs. 900" },
            ]);
            setMsg("No related videos found");
        }
        fetchVideos();
    }, []);



    const VideoList = () => {
        return (
            !videos.length ? <Text style={styles.textMsg}>{msg}</Text> :
                <View style={styles.cardContainer}>
                    <FlatList
                        data={videos}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Image
                                    style={styles.image}
                                    source={require("../../assets/images/flower.jpg")}
                                />
                            </View>)}
                    />
                </View>
        );
    };

    return (
        <>
            <FlatList
                ListHeaderComponent={
                    <>
                        <Header />
                        <SafeAreaView>
                            <View style={styles.containerTop}>
                                <MaterialCommunityIcons
                                    style={styles.icon}
                                    name="account-group-outline"
                                    size={100}
                                    color="#fff"
                                />
                                <Text style={styles.followingText}>No active Followings yet</Text>
                            </View>
                            <View style={styles.containerMid}>
                                <Text style={styles.text}>You may also like</Text>
                            </View>
                        </SafeAreaView>
                    </>
                }
                data={[{ key: "VideoList" }]} // Placeholder data
                renderItem={() => <VideoList />}
                keyExtractor={(item) => item.key}
                ListFooterComponent={
                    <>
                        <View style={styles.containerFloat}>
                            <Image
                                style={styles.image}
                                source={require("../../assets/images/video-camera.png")}
                            />
                        </View>
                    </>
                }
            />
            <Footer />
        </>

    );
}

const styles = StyleSheet.create({
    containerTop: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#000",
    },
    containerMid: {
        padding: 30,
        backgroundColor: "#000",
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
    followingText: {
        fontSize: 30,
        color: "#fff",
        justifyContent: "center",
        backgroundColor: "#000",
        paddingBottom: 10
    },
    text: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
        alignItems: "flex-start",
        backgroundColor: "#000",
    },
    containerFloat: {
        position: "absolute",
        bottom: 50,
        left: "50%",
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    },
    // image: {
    //     justifyContent: "center",
    //     width: 70,
    //     height: 70,
    // },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        backgroundColor: '#000',
    },
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "50%",  // Adjust width to fit the screen better
        height: 300,
        padding: 3,
        minHeight: 350,
    },
    // text: {
    //     fontWeight: 'bold',
    //     textAlign: 'center',
    //     flexWrap: 'nowrap'
    // },
    textMsg: {
        fontWeight: 'bold',
        textAlign: 'center',
        flexWrap: 'nowrap',
        fontSize: 20,
        marginTop: 50
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
}
);


