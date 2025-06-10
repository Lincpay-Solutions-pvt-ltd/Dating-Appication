import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import ReelsComponent from '../components/ReelsComponent';
import Header from '../components/header';
import Footer from '../components/footer';
import { router, useLocalSearchParams, useRouter } from "expo-router";
const Reels = (props) => {
  const [reel, setReel] = useState(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ReelItem = useLocalSearchParams();

  useEffect(() => {
    if (ReelItem.reel) {
      setReel(JSON.parse(ReelItem.reel));
    } 
  }, [])

  return (
    <View
      style={{
        width: windowWidth,
        height: windowHeight,
        backgroundColor: 'white',
        position: 'relative',
        backgroundColor: 'white',
      }}>
      <Header />
      { <ReelsComponent reel={reel} />}

      <Footer />
    </View>
  );
};

export default Reels;