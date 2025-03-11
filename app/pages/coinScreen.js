import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

const offers = [
    { id: "1", coins: 100, price: "₹51.99", oldPrice: "₹103.98" },
    { id: "2", coins: 250, price: "₹104.99", oldPrice: "₹262.47" },
    { id: "3", coins: 450, price: "₹214.99", oldPrice: "₹483.73" },
    { id: "4", coins: 1125, price: "₹529.99", oldPrice: "₹1,192.48" },
    { id: "5", coins: 2500, price: "₹1,059.99", oldPrice: "₹2,649.98" },
    { id: "6", coins: 3000, price: "₹1,589.99", oldPrice: "₹3,179.98" },
];

const CoinsScreen = () => {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(19 * 60 + 12); // 19 hours and 12 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(interval);
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    return (
        <ScrollView>
            <View style={styles.container}>
                {/* Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon name="arrow-back" style={styles.backIcon} size={28} color="white" />
                    </TouchableOpacity>
                    <Image style={styles.coinImage} source={require("../../assets/images/coin.png")} />
                    <Text style={styles.coinsText}>10</Text>
                </View>

                {/* Best Offers Section */}
                <View>
                    <Text style={styles.sectionTitle}>Best Offers</Text>
                    <View style={styles.offerGrid}>
                        {offers.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.offerCard}>
                                <Text style={styles.coinText}>
                                    <Image style={styles.coinImage} source={require("../../assets/images/coin.png")} /> {item.coins}
                                </Text>
                                <Image style={styles.amountPic} source={require("../../assets/images/coins_4.png")} />
                                <Text style={styles.price}>{item.price}</Text>
                                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* More Offers Section */}
                <View style={styles.moreOfferContainer}>
                    <Text style={styles.sectionTitle}>More Offers</Text>
                    <View style={styles.moreOfferCard}>
                        <Text style={styles.moreOfferText}>+100% More ⏳ {formatTime(timeLeft)}</Text>
                        <Text style={styles.coinText}><Image style={styles.coinImage} source={require("../../assets/images/coin.png")} /> 100</Text>
                        <Text style={styles.price}>₹51.99</Text>
                    </View>
                </View>

                {/* Best Offers Section (Duplicate) */}
                <View>
                    <Text style={styles.sectionTitle}>Best Offers</Text>
                    <View style={styles.offerGrid}>
                        {offers.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.offerCard}>
                                <Text style={styles.coinText}>
                                    <Image style={styles.coinImage} source={require("../../assets/images/coin.png")} /> {item.coins}
                                </Text>
                                <Text style={styles.price}>{item.price}</Text>
                                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#000",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    backIcon: {
        marginRight: 8,
    },
    coinImage: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    coinsText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    amountPic: {
        left: 40,
        width: 80,
        height: 80,
        padding: 8,
       },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        color: "white",
    },
    offerGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    offerCard: {
        width: "48%",
        marginBottom: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 8,
    },
    moreOfferContainer: {
        marginTop: 16,
    },
    moreOfferCard: {
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 8,
        padding: 16,
    },
    moreOfferText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "white",
    },
    coinText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "white",
    },
    price: {
        fontSize: 16,
        left: 40,
        fontWeight: "bold",
        color: "white",
    },
    oldPrice: {
        fontSize: 16,
        left: 40,
        color: "gray",
        textDecorationLine: "line-through",
    },
});

export default CoinsScreen;