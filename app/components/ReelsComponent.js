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
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";
import axios from "axios";

const { width, height } = Dimensions.get("window");




export default function ReelsComponent(props) {
  const pathname = usePathname();
  const [likedVideos, setLikedVideos] = useState({});
  const [videoComments, setVideoComments] = useState({});
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [Database, setDatabase] = useState([]);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 80 };
  const [itemUserID, setItemUserID] = useState("");
  const [currentUserID, setCurrentUserID] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await AsyncStorage.getItem("User");
        console.log("getUser called = ", user);

        if (user) {
          const parsedUser = JSON.parse(user);
          const userID = parsedUser.userID;
          setCurrentUserID(userID);
        }
      } catch (err) {
        console.error("Error parsing user from AsyncStorage", err);
      }
    };

    getUser();
    setIsSaved(false);
  }, []);

  useEffect(() => {
    if (currentUserID) {
      console.log("✅ currentUserID updated = ", currentUserID);
    }
  }, [currentUserID]);



  useEffect(() => {
    const fetchReels = async () => {
      try {
        const response = await axios.get("http://192.168.0.104:5000/api/v1/reels/get-latest");
        const fetchedReels = response.data.data;

        let updatedReels = fetchedReels;
        if (props.reel) {
          // Always place the selected reel at the top
          const filteredReels = fetchedReels.filter(item => item.filepath !== props.reel.filepath);
          updatedReels = [props.reel, ...filteredReels];
        }

        const initialComments = {};
        updatedReels.forEach((video) => {
          initialComments[video.video] = [
            { user: "User1", comment: "Great video!" },
            { user: "User2", comment: "Amazing content!" },
          ];
        });

        setDatabase(updatedReels);
        setVideoComments(initialComments);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReels();
  }, [props]);

  const ReelItem = ({ item, shouldPlay, likedVideos, setLikedVideos, setShowCommentModal, setShowOptionsModal, openShareOptions,
  }) => {

    const video = useRef(null);
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);

    useEffect(() => {
      if (!video.current) return;
      if (shouldPlay) {
        console.log("itemUserID = ", item.userID);
        console.log("ReelItem printing ");

        video.current.playAsync();

        setItemUserID(item.userID);
        // console.log("itemReelID = ", item.reelId);


      } else {
        video.current.pauseAsync();
        video.current.setPositionAsync(0);
      }
    }, [shouldPlay]);

    useEffect(() => {
      return () => {
        if (video.current) {
          video.current.pauseAsync();
          video.current.setPositionAsync(0);
        }
      };
    }, [pathname]);


    const showMoreOptions = () => {

      setShowMoreOptionsModal(true);

    };

    const closeMoreOptions = () => {
      setShowMoreOptionsModal(false);
    };




    const deleteReel = async () => {
      console.log("Reel with ID:", myReelID);
      try {
        await axios.delete(`http://192.168.0.104:5000/api/v1/reels/delete/${myReelID}`);
        setShowMoreOptionsModal(false);
        console.log("Reel deleted successfully");
      } catch (error) {
        console.log("Cannot delete the reel => ", error);
      }
    };

    const ReelManagement = () => {
      if(isSaved)
      {
        setIsSaved(false);
        console.log("Removed from saved reels  "); 
      }
      else
      {
        setIsSaved(true);
        console.log("Added to saved reels  ");
      }
    };

    return (
      <View style={styles.videoContainer}>
        <Pressable
          onPress={() => {
            try {
              if (status?.isPlaying) {
                video.current?.pauseAsync();

              } else {
                video.current?.playAsync();
              }
            } catch (error) {
              console.log("Error toggling video", error);
            }
          }}
        >
          {shouldPlay && (
            <Video
              ref={video}
              source={{ uri: `http://192.168.0.104:5000/reels${item.filepath}` }}
              style={styles.video}
              isLooping={false}
              resizeMode={ResizeMode.COVER}
              useNativeControls={false}
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
              onBuffer={({ isBuffering }) => setIsLoading(isBuffering)}
            />
          )}

          {isLoading && shouldPlay && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </Pressable>

        {/* Overlay icons */}
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

            <TouchableOpacity style={styles.iconWrapper} onPress={() => showMoreOptions()}>
              <Entypo name="dots-three-vertical" size={23} color="white" />
            </TouchableOpacity>
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
        {/* More Options Modal */}
        <Modal
          visible={showMoreOptionsModal}
          animationType="slide"
          transparent={true}
          onRequestClose={closeMoreOptions}
        >
          <Pressable style={styles.modalOverlay} onPress={closeMoreOptions}>
            <View style={styles.modalContainer}>
              <View style={styles.modalOptionRow}>
                <TouchableOpacity style={styles.optionButton}>
                  <MaterialIcons name="report" size={24} color="red" />
                  <Text style={styles.modalText}>Report</Text>
                </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.modalOptionRow}>
                <TouchableOpacity style={styles.optionButton} onPress={ReelManagement}>
                  <MaterialIcons name={isSaved ?"bookmark":"bookmark-border"} size={24} color="black" />
                  <Text style={styles.modalText}>Save</Text>
                </TouchableOpacity>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.modalOptionRow}>
                {currentUserID !== "" && currentUserID === itemUserID && (
                  <TouchableOpacity style={styles.optionButton} onPress={deleteReel}>
                    <MaterialCommunityIcons name="delete-outline" size={24} color="red" />
                    <Text style={styles.modalText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Pressable>

        </Modal>
      </View >
    );
  };

  const LikeIcon = ({ item, likedVideos, setLikedVideos }) => {
    const isLiked = likedVideos[item.video] || false;
    const toggleLike = () => {
      setLikedVideos((prev) => ({
        ...prev,
        [item.video]: !prev[item.video],
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

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

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
            shouldLoad={
              Math.abs(index - currentViewableItemIndex) <= 1 // load only current, previous, next
            }
            likedVideos={likedVideos}
            setLikedVideos={setLikedVideos}
            setShowCommentModal={setShowCommentModal}
            setShowOptionsModal={setShowOptionsModal}
            openShareOptions={openShareOptions}

          />
        )}
        keyExtractor={(item) => item.filepath}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={height}
      />

      {/* You can add modals for comments/options here */}
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
  followButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followButtonText: {
    fontWeight: "bold",
    color: "black",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  moreOptions: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '500',
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // or use marginLeft on Text if gap is not supported
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
});
