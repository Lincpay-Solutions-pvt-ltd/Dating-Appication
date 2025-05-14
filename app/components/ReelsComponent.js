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
  const [isLiked, setIsLiked] = useState(false);


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
        const response = await axios.get("http://192.168.0.110:5000/api/v1/reels/get-latest");
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
            // { user: "User1", comment: "Great video!" },
            // { user: "User2", comment: "Amazing content!" },
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


  // useEffect(() => {
  //   const checkLikes = async () => {
  //     try {
  //       const response = await axios.get("http://192.168.0.110:5000/api/v1/reels/interaction-status/31604509-54bf-475e-90ba-c3acf37367ab/0ddc7770-bb8f-4308-aad5-4e483770fd07");
  //       const fetchedReels = response.data.data;
  //       //check if the reel is liked or not
  //       setIsLiked(fetchedReels.isLiked);
  //       console.log("Reel isLiked = ", fetchedReels.isLiked);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   checkLikes();
  // },);


  const ReelItem = ({ item, shouldPlay, likedVideos, setLikedVideos, setShowCommentModal, setShowOptionsModal, openShareOptions,
  }) => {
    const video = useRef(null);
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);

    var myReelID = "";
    useEffect(() => {

      const checkLikes = async () => {
        try {
          const response = await axios.get(`http://192.168.0.110:5000/api/v1/reels/interaction-status/${item.reelId}/${item.userID}`);

          //console.log("Response:", response);
          setIsLiked(response.data.data.isLiked);
          console.log("Reel isLiked = ", response.data.data.isLiked);
        }
        catch (error) {
          // Log the whole error object for clarity
          console.error("Error fetching like status:", error.message);
        }
      };

      checkLikes();
    }, [item.reelId]);


    useEffect(() => {
      if (!video.current) return;
      if (shouldPlay) {
        console.log("itemUserID = ", item.userID);
        console.log("MyReelID_1 = ", item.reelId);

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


    const likeReel = async (userID, reelId) => {
      setIsLiked(true);

      let data = JSON.stringify({
        "userID": userID,
        "reelId": reelId
      });
      console.log("isLiked = ", isLiked);

      console.log("MyReelID_2 = ", item.reelId);
      try {
        await axios.post('http://192.168.0.110:5000/api/v1/reels/like', data, {
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async function (response) {
          console.log(response.data);
          // await AsyncStorage.setItem("userID", JSON.stringify(response.data.data.userID));
          // await AsyncStorage.setItem("reelID", JSON.stringify(response.data.data.reelId));
        });
        console.log("Reel liked successfully = ", item.reelId);
      } catch (error) {
        console.log("Cannot like the reel => ", error);
      }
    }

    const dislikeReel = async (userID, reelId) => {
      setIsLiked(false);
      let data = JSON.stringify({
        "userID": userID,
        "reelId": reelId
      });
      try {
        await axios.post('http://192.168.0.110:5000/api/v1/reels/dislike', data, {
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async function (response) {
          console.log(response.data);
          // await AsyncStorage.setItem("userID", JSON.stringify(response.data.data.userID));
          // await AsyncStorage.setItem("reelID", JSON.stringify(response.data.data.reelId));
        });
        console.log("Reel disliked successfully = ", item.reelId);
      } catch (error) {
        console.log("Cannot dislike the reel => ", error);
      }
    }

    const commentReel = async (userID, reelId, commentId) => {
      try {
        let data = JSON.stringify({
          "userID": userID,
          "reelId": reelId,
          "commentId": commentId
        });
        await axios.post('http://localhost:5000/api/v1/reels/add-comment', data, {
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async function (response) {
          console.log(response.data);
          // await AsyncStorage.setItem("userID", JSON.stringify(response.data.data.userID));
          // await AsyncStorage.setItem("reelID", JSON.stringify(response.data.data.reelId));
        });
        console.log("Reel commented successfully = ", item.reelId);
      } catch (error) {
        console.log("Cannot comment the reel => ", error);
      }
    }
    const deleteReel = async () => {
      console.log("Reel with ID:", item.reelId);
      try {
        await axios.delete(`http://192.168.0.110:5000/api/v1/reels/delete/${item.reelId}`);
        setShowMoreOptionsModal(false);
        console.log("Reel deleted successfully");
      } catch (error) {
        console.log("Cannot delete the reel => ", error);
      }
    };

    const ReelManagement = () => {
      if (isSaved) {
        setIsSaved(false);
        console.log("Removed from saved reels  ");
      }
      else {
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
              source={{ uri: `http://192.168.0.110:5000/reels${item.filepath}` }}
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

            <Pressable style={styles.iconWrapper} onPress={() => isLiked ? dislikeReel(currentUserID, item.reelId) : likeReel(currentUserID, item.reelId)}>
              <FontAwesome name={isLiked ? "heart-o" : "heart"} size={25} color={isLiked ? "white" : "red"} />
              <Text style={styles.iconText}>106</Text>
            </Pressable>

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
                  <MaterialIcons name={isSaved ? "bookmark" : "bookmark-border"} size={24} color="black" />
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

  // const LikeIcon = ({ item, likedVideos, setLikedVideos }) => {
  //   const isLiked = likedVideos[item.video] || false;
  //   const toggleLike = () => {
  //     setLikedVideos((prev) => ({
  //       ...prev,
  //       [item.video]: !prev[item.video],
  //     }));
  //   };
  //   return (
  //     <Pressable style={styles.iconWrapper} onPress={() => toggleLike()}>
  //       <FontAwesome name={isLiked ? "heart" : "heart-o"} size={25} color={isLiked ? "red" : "white"} />
  //       <Text style={styles.iconText}>106</Text>
  //     </Pressable>
  //   );
  // };

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
        renderItem={({ item, index }) =>
          index === currentViewableItemIndex ? (
            <ReelItem
              item={item}
              shouldPlay={index === currentViewableItemIndex}
              likedVideos={likedVideos}
              setLikedVideos={setLikedVideos}
              setIsLiked={setIsLiked}
              setShowCommentModal={setShowCommentModal}
              openShareOptions={openShareOptions}
              currentUserID={currentUserID}
            />
          ) : (
            <View style={{ height }} /> // placeholder to keep the scroll height consistent
          )
        }
        keyExtractor={(item) => item.filepath}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={height}
        windowSize={2} // Only render current + 1 screen ahead
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        removeClippedSubviews={true}
      />



      {/* You can add modals for comments/options here */}
      {/* Comment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCommentModal}
        onRequestClose={() => setShowCommentModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCommentModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.commentModal}>
                <Text style={styles.commentHeader}>Comments</Text>
                <FlatList
                  data={videoComments[Database[currentViewableItemIndex]?.video] || []}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                      <Text style={styles.commentUser}>{item.user}:</Text>
                      <Text style={styles.commentText}>{item.comment}</Text>
                    </View>
                  )}
                  contentContainerStyle={{ paddingBottom: 40 }}
                />

                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity style={styles.commentButton} onPress={addComment}>
                    <Text style={styles.sendButtonText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { width, height },
  video: { width: '100%', height: '92%', borderRadius: 12 },
  overlay: {
    position: 'absolute',
    width,
    height,
    justifyContent: 'space-between',
    padding: 24,
  },
  profileContainer: {
    position: 'absolute',
    bottom: 180,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileTextContainer: { marginLeft: 12 },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  username: { color: '#fff', fontWeight: '600', fontSize: 15 },
  description: { color: '#eaeaea', fontSize: 13, marginTop: 6 },
  iconContainer: {
    position: 'absolute',
    bottom: 160,
    right: 14,
    alignItems: 'center',
    gap: 28,
  },
  iconWrapper: { alignItems: 'center' },
  iconText: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  followButton: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  followButtonText: {
    fontWeight: '600',
    color: '#000',
    fontSize: 13,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  moreOptions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 22,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  modalText: {
    fontSize: 19,
    color: '#222',
    fontWeight: '500',
  },
  modalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  commentModal: {
    backgroundColor: '#fff',
    width: '100%',
    height: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    position: 'absolute',
    bottom: 0,
  },
  commentHeader: {
    fontSize: 19,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  commentItem: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  commentUser: {
    fontWeight: '200',
    marginRight: 6,
    color: '#000',
    fontSize: 20,
  },
  commentText: {
    color: '#444',
    fontSize: 18,
    letterSpacing: 1,
    lineHeight: 22,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    maxWidth: '80%',
  },
  commentInputContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fafafa",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  commentInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,           // Increase to avoid bottom clipping
    paddingVertical: 10,      // Make vertical padding more generous
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  sendButtonText: {
    backgroundColor: "#007aff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
    borderRadius: 30, // Make the button rounder and remove the bor
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
});