import React from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Header from "../components/header";
import Footer from '../components/footer';
import { useRouter, usePathname, Link } from "expo-router";


const ChatList = () => {
    const router = useRouter();

    const messages = [
        {
            id: "1",
            name: "Jan",
            message: "Hi there , lets chat ! ! ! !",
            time: "11:45",
            avatar: "https://via.placeholder.com/50", // Replace with actual image URL
        },
        {
            id: "2",
            name: "Feb",
            message: "Hi there , lets chat ! ! ! !",
            time: "11:50",
            avatar: "https://via.placeholder.com/50", // Replace with actual image URL
        },
        {
            id: "3",
            name: "Mar",
            message: "Hi there , lets chat ! ! ! !",
            time: "11:55",
            avatar: "https://via.placeholder.com/50", // Replace with actual image URL
        },
        {
            id: "4",
            name: "Apr",
            message: "Hi there , lets chat ! ! ! !",
            time: "12:00",
            avatar: "https://via.placeholder.com/50", // Replace with actual image URL
        },
        {
            id: "5",
            name: "May",
            message: "Hi there , lets chat ! ! ! !",
            time: "12:05",
            avatar: "https://via.placeholder.com/50", // Replace with actual image URL
        },
    ];

    return (
        <>
            <Header />
            <View style={styles.container}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    <Image
                        source={{ uri: "https://via.placeholder.com/40" }} // Replace with actual avatar URL
                        style={styles.avatar}
                    />
                    {/* <Text style={styles.coinText}>0</Text> */}
                </View>

                {/* Banner */}
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>Special First-Time Offer!</Text>
                    <Text style={styles.bannerSubText}>150% More</Text>
                </View>

                {/* Chat List */}
                <TouchableOpacity onPress={() => router.push("../pages/chats")}>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.messageItem}>
                                <Image source={require("../../assets/images/profile.jpg")} style={styles.messageAvatar} />
                                <View style={styles.messageContent}>
                                    <Text style={styles.messageName}>{item.name}</Text>
                                    <Text style={styles.messageText}>{item.message}</Text>
                                </View>
                                <Text style={styles.messageTime}>{item.time}</Text>
                            </View>
                        )}
                    />
                </TouchableOpacity>
            </View>
            <Footer />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        padding: 10,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    coinText: {
        color: "#fff",
        fontSize: 16,
    },
    banner: {
        backgroundColor: "orange",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    bannerText: {
        fontWeight: "bold",
        color: "#fff",
    },
    bannerSubText: {
        color: "#fff",
    },
    messageItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#222",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    messageAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    messageContent: {
        flex: 1,
        marginLeft: 10,
    },
    messageName: {
        fontWeight: "bold",
        color: "#fff",
    },
    messageText: {
        color: "#bbb",
    },
    messageTime: {
        color: "#888",
    },
});

export default ChatList;