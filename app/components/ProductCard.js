import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity,FlatList } from "react-native";

const videos = [
  { id: "1", title: "Product 1", price: "Rs. 100" },
  { id: "2", title: "Product 2", price: "Rs. 200" },
  { id: "3", title: "Product 3", price: "Rs. 300" },
  { id: "4", title: "Product 4", price: "Rs. 400" },
  { id: "5", title: "Product 5", price: "Rs. 500" },
  { id: "6", title: "Product 6", price: "Rs. 600" },
  { id: "7", title: "Product 7", price: "Rs. 700" },
  { id: "8", title: "Product 8", price: "Rs. 800" },
  { id: "9", title: "Product 9", price: "Rs. 900" },
  
];
const ProductCard = ({ title, price }) => {
  return (
    <View style={styles.card}>
      <Image style = {styles.image} source={require("../../assets/images/google.png")}></Image>
    </View>
  );
};

const VideoList = () => {
  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => <ProductCard title={item.title} price={item.price} />}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flex: '2',
    width: '40%',  // Adjust width to fit the screen better
    padding: 100,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'nowrap'
  },
  image: {
    width: 100,
    height: 100
  },

});


export default VideoList;

