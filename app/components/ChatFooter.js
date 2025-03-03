import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SimpleLineIconsIcon from 'react-native-vector-icons/SimpleLineIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const ChatFooter = () => {
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  const emojiData = [
    { id: '1', icon: '🧑‍🎤', coins: 1099 },
    { id: '2', icon: '🦄', coins: 1499 },
    { id: '3', icon: '⭐', coins: 3 },
    { id: '4', icon: '💖', coins: 8 },
    { id: '5', icon: '🐱', coins: 4 },
    { id: '6', icon: '🍎', coins: 5 },
    { id: '7', icon: '🐯', coins: 9 },
    { id: '8', icon: '🎯', coins: 11 },
  ];

  const openCamera = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'You need to grant camera permission to use this feature.');
        return;
      }
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
        maxWidth: 480,
        maxHeight: 480,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorMessage) {
          console.error('Camera Error: ', response.errorMessage);
        } else {
          console.log('Photo captured: ', response.assets);
        }
      }
    );
  };

  const openGallery = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'You need to grant storage permission to use this feature.');
        return;
      }
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        maxWidth: 480,
        maxHeight: 480,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled gallery');
        } else if (response.errorMessage) {
          console.error('Gallery Error: ', response.errorMessage);
        } else {
          console.log('Photo selected: ', response.assets);
        }

      }
    );
  }

  return (
    <View style={styles.container}>
      {/* Emoji Scroll */}
      <FlatList
        horizontal
        data={emojiData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ alignItems: 'center', marginHorizontal: 6 }}>
            <Text style={{ fontSize: 24 }}>{item.icon}</Text>
            <Text style={{ color: 'gold', fontSize: 12 }}>{item.coins}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
      {/* Chat Input Row */}
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.footerIcons}>
          <Text style={{ color: 'white', fontSize: 14, marginRight: 10 }}>GIF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcons} onPress={openCamera}>
          <SimpleLineIconsIcon name="camera" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcons} onPress={() => setIsRecording(prev => !prev)}>
          <Ionicons name={isRecording ? "mic" : "mic-off"} size={30} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIcons}>
          <Ionicons name="gift" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#000',
    bottom: 0,
    alignContent: 'center',
    padding: 10,
    marginHorizontal: 20,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#222',
    borderRadius: 25,
    padding: 8,
  },
  textInput: {
    flex: 1,
    color: 'white',
    paddingHorizontal: 10,
  },
  footerIcons: {
    padding: 5,
  },
});

export default ChatFooter;
