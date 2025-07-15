import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    mediaDevices,
    MediaStream
} from 'react-native-webrtc';
import { PermissionsAndroid, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '../services/SocketContext';
import { router, useLocalSearchParams } from 'expo-router';

const iceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ]
};

const VideoCallScreen = () => {
    const { socket } = useSocket();
    const { caller, receiver, chatID, isCaller, status_ } = useLocalSearchParams();
    const [status, setStatus] = useState(status_ ? status_ : isCaller === 'true' ? 'Calling...' : 'Ringing...');
    const [isMuted, setIsMuted] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [localStreamURL, setLocalStreamURL] = useState(null);
    const [remoteStreamURL, setRemoteStreamURL] = useState(null);
    const pc = useRef(null);
    const [isInitCall, setIsInitCall] = useState(false);
    const [readyForOffer, setReadyForOffer] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const from = caller;
    const to = receiver;

    const cleanup = async () => {
        if (pc.current) {
            pc.current.close();
            pc.current = null;
        }
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
            setLocalStream(null);
            setLocalStreamURL(null);
        }
        setRemoteStream(null);
        setRemoteStreamURL(null);
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);
            const allGranted = Object.values(granted).every(
                permission => permission === PermissionsAndroid.RESULTS.GRANTED
            );
            if (!allGranted) {
                Alert.alert('Permission Denied', 'Camera and microphone access is required.');
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const initCall = async () => {
            const granted = await requestPermissions();
            if (!granted) return null;
            const stream = await mediaDevices.getUserMedia({ audio: true, video: true });
            setLocalStream(stream);
            setLocalStreamURL(stream.toURL());

            if (status_ === 'ringing') {
                socket.emit('accept-call', { to: caller, from: receiver });
                setStatus('Connecting...');
            } else {
                socket.emit('start-call', { to: receiver, from: caller, chatID });
            }
            setReadyForOffer(true);
            setIsInitCall(true);
        };
        initCall();
        return () => cleanup();
    }, []);

    const PeerConnection = (function () {
        let peerConnection;
        const createPeerConnection = async (stream) => {
            peerConnection = new RTCPeerConnection(iceServers);
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

            peerConnection.ontrack = (event) => {
                if (event.track.kind === 'video') {
                    const remoteStream = new MediaStream();
                    remoteStream.addTrack(event.receiver.track);
                    setRemoteStream(remoteStream);
                    setRemoteStreamURL(remoteStream.toURL());
                }
            };

            peerConnection.onicecandidate = ({ candidate }) => {
                if (candidate) socket.emit("icecandidate", { candidate, to });
            };
            return peerConnection;
        };
        return {
            getInstance: async () => {
                if (!peerConnection) peerConnection = await createPeerConnection(localStream);
                pc.current = peerConnection;
                return peerConnection;
            },
        };
    })();

    useEffect(() => {
        if (isInitCall && readyForOffer) {
            const sendOffer = async () => {
                const pc = await PeerConnection.getInstance();
                const offer = await pc.createOffer({
                    offerToReceiveVideo: true,
                    offerToReceiveAudio: true,
                    voiceActivityDetection: false
                });
                await pc.setLocalDescription(offer);
                socket.emit("offer", { from, to, offer: pc.localDescription });
            };
            sendOffer();
        }
    }, [readyForOffer, isInitCall]);

    useEffect(() => {
        if (isInitCall) {
            socket.on("offer", async ({ from, offer }) => {
                if (!localStream) {
                    const localStream_ = await mediaDevices.getUserMedia({ audio: true, video: true });
                    setLocalStream(localStream_);
                    setLocalStreamURL(localStream_.toURL());
                }
                const pc = await PeerConnection.getInstance();
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("answer", { from: to, to: from, answer });
                setStatus("Connected");
            });
            socket.on("answer", async ({ answer }) => {
                const pc = await PeerConnection.getInstance();
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            });
            socket.on("call-accepted", () => setStatus("Connected"));
            socket.on("icecandidate", async (candidate) => {
                const pc = await PeerConnection.getInstance();
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            });
            socket.on("call-rejected", async () => {
                await cleanup();
                alert("Call Declined");
                if (router.canGoBack()) router.back();
            });
            socket.on("user-video-call-disconnect", async () => {
                await cleanup();
                if (router.canGoBack()) router.back();
            });
        }
        return () => {
            socket.off("offer");
            socket.off("answer");
            socket.off("icecandidate");
            socket.off("call-accepted");
            socket.off("call-rejected");
            socket.off("user-video-call-disconnect");
        };
    }, [isInitCall]);

    const toggleMute = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const switchCamera = () => {
        const videoTrack = localStream?.getVideoTracks?.()[0];
        if (videoTrack && videoTrack._switchCamera) {
            videoTrack._switchCamera();
        }
    };

    const endCall = async () => {
        socket.emit("user-video-call-disconnect", { from, to });
        socket.emit("end-call", { to: isCaller === 'true' ? receiver : caller });
        await cleanup();
        if (router.canGoBack()) router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.status}>{status}</Text>
            {remoteStreamURL ? (
                <RTCView
                    streamURL={remoteStreamURL}
                    style={styles.remoteVideo}
                    objectFit="cover"
                    mirror={false}
                    zOrder={0}
                />
            ) : (
                <View style={styles.remoteVideoPlaceholder}>
                    <Text style={styles.text}>🔄 Waiting for remote video...</Text>
                </View>
            )}
            {localStreamURL && (
                <RTCView
                    streamURL={localStreamURL}
                    style={styles.localVideo}
                    objectFit="cover"
                    mirror={true}
                    zOrder={2}
                />
            )}
            <View style={styles.controls}>
                <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                    <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={switchCamera} style={styles.controlButton}>
                    <Ionicons name="camera-reverse" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={endCall} style={styles.controlButton}>
                    <Ionicons name="call" size={32} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    remoteVideo: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'red'
    },
    remoteVideoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222'
    },
    localVideo: {
        position: 'absolute',
        width: 120,
        height: 160,
        bottom: 100,
        right: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white'
    },
    controls: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    controlButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        borderRadius: 50
    },
    status: {
        position: 'absolute',
        top: 50,
        color: 'white',
        fontSize: 18,
        zIndex: 100
    },
    text: {
        color: 'white',
        fontSize: 16
    }
});

export default VideoCallScreen;