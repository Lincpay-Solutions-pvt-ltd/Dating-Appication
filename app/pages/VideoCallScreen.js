// VideoCallScreen.js
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
import { useRouter, useLocalSearchParams } from 'expo-router';

const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun2.1.google.com:19302" }]
};

const VideoCallScreen = () => {
    const { socket } = useSocket();
    const router = useRouter();
    const { caller, receiver, chatID, isCaller } = useLocalSearchParams();

    const pc = useRef(null);
    const localStream = useRef(null);
    const remoteStream = useRef(null);

    const [localStreamURL, setLocalStreamURL] = useState(null);
    const [remoteStreamURL, setRemoteStreamURL] = useState(null);
    const [status, setStatus] = useState(isCaller === 'true' ? 'Calling...' : 'Ringing...');
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const init = async () => {
            const stream = await startLocalStream();
            if (stream) {
                createPeerConnection(stream);
                setupSocketEvents();

                if (isCaller === 'true') {
                    setTimeout(() => {
                        if (status !== 'Connected') {
                            Alert.alert('Call failed', 'User did not respond.');
                            endCall();
                        }
                    }, 30000);

                    makeOffer(); // move here after everything is ready
                }
            } else {
                Alert.alert("Error", "Could not access camera/mic.");
                // router.back();
            }
        };

        init();
        return () => cleanup();
    }, []);
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

    const startLocalStream = async () => {
        const granted = await requestPermissions();
        if (!granted) return null;
        try {
            const stream = await mediaDevices.getUserMedia({ audio: true, video: true });
            localStream.current = stream;
            setLocalStreamURL(stream.toURL());
            return stream;
        } catch (err) {
            console.error('Error accessing media devices:', err);
            return null;
        }
    };


    const createPeerConnection = (stream) => {
        pc.current = new RTCPeerConnection(iceServers);

        stream.getTracks().forEach(track => {
            pc.current.addTrack(track, stream);
        });

        const newRemoteStream = new MediaStream();
        remoteStream.current = newRemoteStream;

        pc.current.ontrack = event => {
            event.streams[0].getTracks().forEach(track => {
                newRemoteStream.addTrack(track);
            });
            setRemoteStreamURL(newRemoteStream.toURL());
            setStatus('Connected');
        };

        pc.current.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('ice-candidate', {
                    to: isCaller === 'true' ? receiver : caller,
                    from: isCaller === 'true' ? caller : receiver,
                    candidate: event.candidate
                });
            }
        };
    };


    const setupSocketEvents = () => {
        socket.on('video-offer', async ({ offer, from }) => {
            if (!pc.current) createPeerConnection();
            await pc.current.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);

            socket.emit('video-answer', {
                to: from,
                from: receiver,
                answer
            });
        });

        socket.on('video-answer', async ({ answer }) => {
            await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
            setStatus('Connected');
        });

        socket.on('ice-candidate', async ({ candidate }) => {
            try {
                await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error('Error adding ice candidate', err);
            }
        });

        socket.on('call-rejected', () => {
            Alert.alert('Call Rejected');
            endCall();
        });

        socket.on('end-call', () => {
            Alert.alert('Call Ended');
            endCall();
        });
    };

    const makeOffer = async () => {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);

        socket.emit('video-offer', {
            to: receiver,
            from: caller,
            offer
        });
    };

    const toggleMute = () => {
        const audioTrack = localStream.current?.getAudioTracks()?.[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    const switchCamera = () => {
        const videoTrack = localStream.current?.getVideoTracks()?.[0];
        if (videoTrack && videoTrack._switchCamera) {
            videoTrack._switchCamera();
        }
    };

    const endCall = () => {
        socket.emit('end-call', {
            to: isCaller === 'true' ? receiver : caller
        });
        cleanup();
        router.back();
    };

    const cleanup = () => {
        try {
            localStream.current?.getTracks()?.forEach(track => track.stop());
            remoteStream.current?.getTracks()?.forEach(track => track.stop());
            pc.current?.close();
        } catch (err) {
            console.error('Cleanup error:', err);
        }
        socket.off('video-offer');
        socket.off('video-answer');
        socket.off('ice-candidate');
        socket.off('call-rejected');
        socket.off('end-call');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.status}>{status}</Text>
            {localStreamURL && (
                <>
                    <Text style={styles.text}>🎥 Local Video Ready</Text>
                    <RTCView streamURL={localStreamURL} style={styles.localVideo} objectFit="cover" />
                </>
            )}
            {!localStreamURL && <Text style={styles.text}>⚠️ Local stream not ready</Text>}
            {!remoteStreamURL && <Text style={styles.text}>⚠️ Waiting for remote stream...</Text>}
            {remoteStreamURL ? (
                <RTCView streamURL={remoteStreamURL} style={styles.remoteVideo} objectFit="cover" />
            ) : (
                <View style={styles.remoteVideoPlaceholder}>
                    <Text style={styles.text}>Waiting for user...</Text>
                </View>
            )}

            {localStreamURL && (
                <RTCView streamURL={localStreamURL} style={styles.localVideo} objectFit="cover" />
            )}

            <View style={styles.controls}>
                <TouchableOpacity onPress={toggleMute}>
                    <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={switchCamera}>
                    <Ionicons name="camera-reverse" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={endCall}>
                    <Ionicons name="call" size={32} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VideoCallScreen;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    remoteVideo: {
        width,
        height,
        position: 'absolute',
        zIndex: 1
    },
    remoteVideoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    localVideo: {
        width: 120,
        height: 160,
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 2,
        borderRadius: 10
    },
    controls: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    status: {
        color: '#fff',
        textAlign: 'center',
        padding: 10
    },
    text: {
        color: '#fff'
    }
});
