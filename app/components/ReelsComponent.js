import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  Text,
  Modal,
  TextInput,
  Button,
  Share,
  TouchableWithoutFeedback,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Database } from "./Database";
import { usePathname } from "expo-router";

const { width, height } = Dimensions.get("window");

const ReelItem = ({ item, shouldPlay, likedVideos, setLikedVideos, setShowCommentModal, setShowOptionsModal, openShareOptions }) => {
  const video = useRef(null);
  const [status, setStatus] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!video.current) return;

    if (shouldPlay) {
      video.current.playAsync();
    } else {
      video.current.pauseAsync();
      video.current.setPositionAsync(0);
    }
  }, [shouldPlay]);

  // Cleanup function to stop video when component unmounts or route changes
  useEffect(() => {
    return () => {
      if (video.current) {
        video.current.pauseAsync();
        video.current.setPositionAsync(0);
      }
    };
  }, [pathname]); 
  return (
    <View style={styles.videoContainer}>
      <Pressable
        onPress={() =>
          status?.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()
        }
      >
        <Video
          ref={video}
          source={{ uri: item.video }}
          style={styles.video}
          isLooping
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      </Pressable>

      {/* Overlay Icons */}
      <View style={styles.overlay}>
        <View style={styles.iconContainer}>
          <Pressable style={styles.iconWrapper} onPress={openShareOptions}>
            <MaterialCommunityIcons name="share-outline" size={25} color="white" />
            <Text style={styles.iconText}>Share</Text>
          </Pressable>

          <LikeIcon item={item} likedVideos={likedVideos} setLikedVideos={setLikedVideos} />
          <Pressable style={styles.iconWrapper} onPress={() => setShowCommentModal(true)}>
            <MaterialIcons name="comment" size={25} color="white" />
            <Text style={styles.iconText}>Comments</Text>
          </Pressable>

          <Pressable style={styles.iconWrapper}>
            <Ionicons name="gift-outline" size={25} color="white" />
            <Text style={styles.iconText}>Gift</Text>
          </Pressable>

          <Pressable style={styles.iconWrapper} onPress={() => setShowOptionsModal(true)}>
            <Entypo name="dots-three-vertical" size={23} color="white" />
          </Pressable>
        </View>

        <View style={styles.profileContainer}>
          <Image source={item.postProfile} style={styles.profileImage} />
          <View style={styles.profileTextContainer}>
            <Text style={styles.username}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <FollowButton />
        </View>
      </View>
    </View>
  );
};

// ... (rest of the code remains the same)
const LikeIcon = ({ item, likedVideos, setLikedVideos }) => {
  const isLiked = likedVideos[item.video] || false;

  const toggleLike = () => {
    setLikedVideos((prev) => ({
      ...prev,
      [item.video]: !prev[item.video], // Toggle like state for the specific video
    }));
  };

  return (
    <Pressable style={styles.iconWrapper} onPress={toggleLike}>
      <FontAwesome name={isLiked ? "heart" : "heart-o"} size={25} color={isLiked ? "red" : "white"} />
      <Text style={styles.iconText}>106</Text>
    </Pressable>
  );
};

const FollowButton = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <Pressable
      style={[styles.followButton, { backgroundColor: isFollowing ? "grey" : "#ffffff" }]}
      onPress={() => setIsFollowing(!isFollowing)}
    >
      <Text style={styles.followButtonText}>{isFollowing ? "Following" : "Follow"}</Text>
    </Pressable>
  );
};

export default function ReelsComponent() {
  const pathname = usePathname();
  const [likedVideos, setLikedVideos] = useState({});
  const [videoComments, setVideoComments] = useState({});
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 80 };
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Initialize comments for each video with default ones
    const initialComments = {};
    Database.forEach((video) => {
      initialComments[video.video] = [
        { user: "User1", comment: "Great video!" },
        { user: "User2", comment: "Amazing content!" },
      ];
    });
    setVideoComments(initialComments);
  }, []);

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const openShareOptions = async () => {
    try {
      const url = Database[currentViewableItemIndex]?.video;
      await Share.share({
        message: `Check out this cool video! ${url}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addComment = () => {
    if (newComment.trim() === "") return;

    const videoKey = Database[currentViewableItemIndex]?.video;
    setVideoComments((prev) => ({
      ...prev,
      [videoKey]: [...(prev[videoKey] || []), { user: "You", comment: newComment }],
    }));
    setNewComment("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Database}
        renderItem={({ item, index }) => (
          <ReelItem
            item={item}
            shouldPlay={index === currentViewableItemIndex}
            likedVideos={likedVideos}
            setLikedVideos={setLikedVideos}
            setShowCommentModal={setShowCommentModal}
            setShowOptionsModal={setShowOptionsModal}
            openShareOptions={openShareOptions}
          />
        )}
        keyExtractor={(item) => item.video}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={height}
      />

      <Modal visible={showCommentModal} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowCommentModal(false)}>
          <View style={styles.commentModalContainer}>
            <View style={styles.commentModal}>
              <Text style={{ color: "white", fontSize: 20, marginBottom: 10 }}>Comments</Text>
              <FlatList
                data={videoComments[Database[currentViewableItemIndex]?.video] || []}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>{item.user}</Text>
                    <Text style={{ color: "grey" }}>{item.comment}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <TextInput
                placeholder="Type a comment..."
                placeholderTextColor="grey"
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
              />
              <Button title="Add Comment" onPress={addComment} />
              <Button title="Close" onPress={() => setShowCommentModal(false)} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={showOptionsModal} transparent={true} animationType="slide" onRequestClose={() => setShowOptionsModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowOptionsModal(false)}>
          <View style={styles.commentModalContainer}>
            <View style={styles.commentModal}>
              <Text style={{ color: "white", fontSize: 20, marginBottom: 10 }}>Options</Text>
              <Text style={{ color: "white", padding: 10 }}>Block User</Text>
              <Text style={{ color: "white", padding: 10 }}>Report This Content</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  videoContainer: { width, height },
  video: { width: "100%", height: "92%" },
  overlay: {
    position: "absolute",
    width,
    height,
    justifyContent: "space-between",
    padding: 20,
  },
  profileContainer: {
    position: "absolute",
    bottom: 170,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  profileTextContainer: { marginLeft: 10 },
  profileImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: "white" },
  username: { color: "white", fontWeight: "bold" },
  description: { color: "white", fontSize: 14, marginTop: 5 },
  iconContainer: {
    position: "absolute",
    bottom: 150,
    right: 10,
    alignItems: "center",
    gap: 25,
  },
  iconWrapper: { alignItems: "center" },
  iconText: { color: "white", fontSize: 10, marginTop: 5, textAlign: "center" },
  commentModalContainer: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.8)" },
  commentModal: { height: "50%", backgroundColor: "black", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  commentInput: { backgroundColor: "grey", color: "white", padding: 10, borderRadius: 5 },
  followButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  followButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});