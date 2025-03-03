import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.5;
const ITEM_HEIGHT = ITEM_WIDTH * 1.2; // Proportional height
const SIDE_ITEM_SCALE = 0.7; // Side items should appear smaller
const ACTIVE_ITEM_SCALE = 0.9; // Center item should be fully visible

const carouselData = [
    { id: '0', empty: true}, // Placeholder
    { id: '1', image: require('../../../assets/images/bronze-level-carousel.png'), title: 'Bronze Agency' },
    { id: '2', image: require('../../../assets/images/silver-level-carousel.png'), title: 'Silver' },
    { id: '3', image: require('../../../assets/images/gold-level-carousel.png'), title: 'Gold' },
    { id: '4', image: require('../../../assets/images/elite-level-carousel.png'), title: 'Elite Agency' },
    { id: '5', image: require('../../../assets/images/royal-level-carousel.png'), title: 'Royal' },
    { id: '6', empty: true }, // Placeholder
];

const Agency = () => {
    const navigation = useNavigation();
    const [activeIndex, setActiveIndex] = useState(1);
    const flatListRef = useRef(null);

    const handleScroll = (event) => {
        let index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
        if (index < 1) index = 1; // Prevent scrolling to id=0
        if (index > carouselData.length - 2) index = carouselData.length - 2; // Prevent going to id=5 (empty placeholder)
        setActiveIndex(index);
    };
    
    const renderItem = ({ item, index }) => {
        if (item.empty) {
            return <View style={{ width: (width - ITEM_WIDTH) / 1 }} />;
        }
        const isActive = index === activeIndex;
        return (
            <View style={[styles.carouselItem, { transform: [{ scale: isActive ? ACTIVE_ITEM_SCALE : SIDE_ITEM_SCALE }] }]}>
            <Image source={item.image} style={[styles.carouselImage, { opacity: isActive ? 1 : 0.5 }]} />
            {isActive && (
                <View style={styles.titleContainer}>
                    <Text style={styles.carouselTitle}>{item.title}</Text>
                </View>
            )}
        </View>
        );
    };
    

    useEffect(() => {
        if (flatListRef.current) {
            // Scroll to the first actual item (index 1) to keep it in the center
            setTimeout(() => {
                flatListRef.current.scrollToIndex({ index: 1.5, animated: false });
            }, 100); // Small delay to ensure proper rendering
        }
    }, []);


    return (
        <View style={styles.container}>    
            <ImageBackground source={require('../../../assets/images/background-gold-dark.png')} style={styles.containerImage} >
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Agency Program</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('InfoPage')}>
                        <Ionicons name="information-circle" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                
                {/* Fixed Circle */}
                <View style={styles.fixedCircle}>      
                {/* Carousel */}
                </View>
                <FlatList 
                    ref={flatListRef}
                    data={carouselData}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    pagingEnabled
                    snapToInterval={ITEM_WIDTH}
                    decelerationRate="fast"
                    onScroll={handleScroll}
                    initialScrollIndex={1}
                    getItemLayout={(data, index) => ({
                        length: ITEM_WIDTH,
                        offset: ITEM_WIDTH * index,
                        index,
                    })}

                />
                {/* Dots Indicator */}
                <View style={styles.dotsContainer}>
                    {carouselData.filter(item => !item.empty).map((_, index) => (
                        <View key={index} style={[styles.dot, activeIndex === index + 1 && styles.activeDot]} />
                    ))}
                </View>
            


            </ImageBackground>
            
            {/* Hero Section */}
            <View style={styles.heroContainer}>
                    
                {/* Criteria Heading */}
                <Text style={styles.criteriaText}>0/3 Criteria Achieved</Text>

                {/* Rocket Container */}
                <View style={styles.rocketContainer}>
                        {/* <Image source={require("../../../assets/gif/rocket.gif")} style={styles.rocketImage} /> */}
                        <LottieView source={require("../../../assets/gif/rocket.json")} autoPlay loop style={styles.rocketImage} />
                        <View style={styles.rocketTextContainer}>
                            <Text style={styles.rocketTitle}>Act Fast to Upgrade Your Status!</Text>
                            <Text style={styles.rocketSubtitle}>Achieve monthly criteria to upgrade to Elite next month</Text>
                        </View>
                    </View>

                    {/* Days Left */}
                    <View style={styles.daysLeftContainer}>
                        <TouchableOpacity style={styles.daysLeftButton}>
                            <Ionicons name="time-outline" size={20} color="red" />
                            <Text style={styles.daysLeftText}>1 days left</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 'auto',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: "transparent",
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    carouselItem: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    containerImage: {
        resizeMode: 'cover',
    },
    fixedCircle: {
        position: 'absolute',
        top: '35%', // Adjust based on design
        left: '46%',
        width: 130, // Slightly increased size
        height: 130,
        borderRadius: 65, // Make it a perfect circle
        borderWidth: 4, // Increased border thickness for a bold look
        borderColor: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Soft translucent background
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateX: -50 }, { scale: 1.1 }], // Centering and slight enlargement
        zIndex: 0, // Keep it above the carousel
        shadowColor: '#000', // Shadow effect for depth
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10, // Adds shadow effect for Android
    },
    carouselImage: {
        width: 90, // Slightly larger image for better visibility
        height: 90,
        opacity: 0.8, // Increase visibility
        resizeMode: 'contain',
    },
    
    
    titleContainer: {
        marginTop: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    carouselTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: "5%",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'gray',
        marginHorizontal: 4,
    },
    activeDot: {    
        backgroundColor: 'red',
        width : 10,
        height : 10
    },
    
    heroContainer: {
        backgroundColor: 'black',
        padding: 20,
    },
    criteriaText: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 15,
    },
    rocketContainer: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
        overflow: "hidden",
        
    },
    rocketImage: {
        width: 50,
        height: 50,
    },
    rocketTextContainer: {
        marginLeft: 10,
        // flex: 1,
        maxWidth: "80%",
    },
    rocketTitle: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16,
    },
    rocketSubtitle: {
        color: "gray",
        flex: "wrap",
        fontSize: 14,
    },
    daysLeftContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    daysLeftButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "black",
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "red",
    },
    daysLeftText: {
        color: "red",
        marginLeft: 5,
    }, 
});

export default Agency;
