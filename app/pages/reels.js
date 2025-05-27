import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ReelsComponent from '../components/ReelsComponent';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';
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
        backgroundColor: 'black',
      }}>
      {/* <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          zIndex: 1,
          padding: 10,
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
          Reels
        </Text>
        <Feather name="camera" style={{fontSize: 25, color: 'white'}} />
      </View> */}
      <Header isTransparent={true} />
      {/* <ReelsComponent reel={reel} /> */}
      { <ReelsComponent reel={reel} />}

      <Footer />
    </View>
  );
};

export default Reels;