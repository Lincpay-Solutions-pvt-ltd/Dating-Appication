import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Footer from "../components/footer";

const data = [
    {
        id: "1",
        name: "Name",
        image: "https://picsum.photos/200/300", // Replace with actual image URL
        views: "7",
        likes: "1.22M",
    },
    {
        id: "2",
        name: "Name",
        image: "https://picsum.photos/200/300",
        views: "14",
        likes: "22.57M",
    },
    {
        id: "3",
        name: "Name",
        image: "https://picsum.photos/200/300",
        views: "14",
        likes: "22.57M",
    },
    {
        id: "4",
        name: "Name",
        image: "https://picsum.photos/200/300",
        views: "14",
        likes: "22.57M",
    },
    {
        id: "5",
        name: "Name",
        image: "https://picsum.photos/200/300",
        views: "14",
        likes: "22.57M",
    },
    {
        id: "6",
        name: "Name",
        image: "https://picsum.photos/200/300",
        views: "14",
        likes: "22.57M",
    },
];

const { width } = Dimensions.get("window");
const titles = ["Nearby", "New", "Gamer","Artists"];

export default ExploreScreen = () => {
    const router = useRouter();
    return (
        <>
            <ScrollView style={styles.container}>
                {titles.map((title, index) => (
                    <View key={index}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={() => router.push("../pages/exploreMore")}>
                            <Text style={[styles.moreText, { alignSelf: 'flex-end', marginRight: 15 }]}>More</Text>
                        </TouchableOpacity>
                        <FlatList
                            data={data}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                    <View style={styles.overlay}>
                                        <Text style={styles.views}>👁 {item.views}</Text>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <Text style={styles.likes}>💎 {item.likes}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                ))}
            </ScrollView>
            <Footer />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    title: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 15,
        top: 13,
    },
    moreText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        bottom: 5,
    },
    card: {
        width: width * 0.5,
        height: 300,
        margin: 10,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        position: "absolute",
        bottom: 10,
        left: 10,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: 5,
        borderRadius: 5,
    },
    views: {
        color: "#fff",
        fontSize: 14,
    },
    name: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    likes: {
        color: "#fff",
        fontSize: 14,
    },
});
