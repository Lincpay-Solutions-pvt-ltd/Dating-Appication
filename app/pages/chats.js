import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ChatFooter from "../components/ChatFooter";

export default function ChatScreen() {
  const navigation = useNavigation();
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleBackPress = () => {
    navigation.navigate('chatList');
  };

  const handleCallPress = () => {
    setShowCallOptions(!showCallOptions);
    setShowProfileOptions(false);
  };

  const handleUsernamePress = () => {
    setShowProfileOptions(!showProfileOptions);
    setShowCallOptions(false);
  };

  const handleBackdropPress = () => {
    setShowProfileOptions(false);
    setShowCallOptions(false);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.profileSection}>
              <Image 
                source={require('../../assets/images/Elephant.png')}
                style={styles.avatar}
              />
              <TouchableOpacity onPress={handleUsernamePress} style={styles.userInfo}>
                <View style={styles.usernameContainer}>
                  <Text style={styles.username}>Rapid Fox</Text>
                  <Ionicons name="chevron-down" size={16} color="#fff" />
                </View>
                <Text style={styles.status}>Active 39 min. ago</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.callButton} onPress={handleCallPress}>
              <Ionicons name="call" size={24} color="#fff" />
              <Ionicons name="chevron-down" size={14} color="#fff" style={styles.callDownIcon} />
            </TouchableOpacity>
          </View>
          
          {/* Chat area */}
          <View style={styles.chatArea}>
            {/* Chat messages would be rendered here */}
          </View>
        </View>
      </TouchableWithoutFeedback>
      
      {/* Profile Options Menu - rendered BEFORE the footer */}
      {showProfileOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <FontAwesome name="image" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Media</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather name="user" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather name="share" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Share profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather name="bell-off" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Mute Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather name="trash-2" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Delete Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather name="flag" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Report User</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Feather name="x-circle" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Block</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Call Options Menu - rendered BEFORE the footer */}
      {showCallOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem}>
            <FontAwesome name="video-camera" size={24} color="#fff" style={styles.optionIcon} />
            <View style={styles.callOptionTextContainer}>
              <Text style={styles.optionText}>Premium Match Call</Text>
              <View style={styles.coinContainer}>
                <View style={styles.coinIcon} />
                <Text style={styles.coinText}>3,000/min</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="videocam-outline" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Video Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <MaterialIcons name="live-tv" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>1:1 Stream</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="call-outline" size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>Audio Call</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* ChatFooter - rendered LAST to ensure proper layering */}
      <ChatFooter/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    width: '100%'
  },
  backdrop: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 5,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  userInfo: {
    marginLeft: 10,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
  status: {
    color: "#999",
    fontSize: 14,
  },
  callButton: {
    padding: 5,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  callDownIcon: {
    marginLeft: 2,
  },
  chatArea: {
    flex: 1,
    padding: 10,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 10, // Add space above the ChatFooter
    left: 0,
    right: 0,
    backgroundColor: "#111",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    zIndex: 10, // Ensure it appears above other components
    maxHeight: '80%', // Limit height to ensure it doesn't cover too much
    overflow: 'scroll', // Allow scrolling if too many options
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
  },
  optionIcon: {
    marginRight: 15,
    width: 30,
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
  },
  callOptionTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFD700",
    marginRight: 5,
  },
  coinText: {
    color: "#fff",
    fontSize: 16,
  }
});