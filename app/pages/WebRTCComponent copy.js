// WebRTCComponentCopy.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet, Text, Alert, Platform, PermissionsAndroid } from 'react-native';
import { RTCView, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices } from 'react-native-webrtc';
import { useSocket } from '../services/SocketContext';

const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const WebRTCComponentCopy = () => {
  const { socket } = useSocket();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStreamURL, setLocalStreamURL] = useState(null);
  const [remoteStreamURL, setRemoteStreamURL] = useState(null);
  const pc = useRef(null);
  const [isCalling, setIsCalling] = useState(false);

  const from = "0ddc7770-bb8f-4308-aad5-4e483770fd07";
  const to = "5c7a9f53-fe61-4b11-afaf-0d465c7a6b04";
  const chatID = "036b2676-6e03-4b34-aedf-ae4efcd3ffca";

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      const allGranted = Object.values(granted).every(p => p === PermissionsAndroid.RESULTS.GRANTED);
      if (!allGranted) {
        Alert.alert("Permissions required", "Camera and Mic are needed for the call.");
        return false;
      }
    }
    return true;
  };

  const createPeerConnection = (stream) => {
    pc.current = new RTCPeerConnection(iceServers);
    stream.getTracks().forEach(track => pc.current.addTrack(track, stream));

    pc.current.onicecandidate = ({ candidate }) => {
      if (candidate) socket.emit("icecandidate", { to, candidate });
    };

    pc.current.ontrack = (event) => {
      console.log("✅ ontrack", event);
      if (event.streams[0]) {
        const remote = event.streams[0];
        setRemoteStream(remote);
        setRemoteStreamURL(remote.toURL());
      }
    };
  };

  const startCall = async () => {
    const granted = await requestPermissions();
    if (!granted) return;

    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: 'user',
        width: 640,
        height: 480,
        frameRate: 30
      }
    });

    console.log('🎥 Got stream:', stream);
    console.log('🎥 Video tracks:', stream.getVideoTracks());

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) {
      console.warn("❌ No video track received from getUserMedia!");
    } else {
      console.log("✅ Video track OK:", videoTrack);
      console.log("🎥 readyState:", videoTrack.readyState);
      console.log("🎥 muted:", videoTrack.muted);
      console.log("🎥 settings:", videoTrack.getSettings?.());
    }


    setLocalStream(stream);
    setLocalStreamURL(stream.toURL());

    createPeerConnection(stream);

    socket.emit("start-call", { from, to, chatID });

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.emit("send-offer", { from, to, offer });

    setIsCalling(true);
  };

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("joinRoom", { chatID });
      socket.emit("joinChatList", { userID: from });
    });

    socket.on("offer", async ({ from: sender, offer }) => {
      const granted = await requestPermissions();
      if (!granted) return;

      const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setLocalStreamURL(stream.toURL());

      createPeerConnection(stream);
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.emit("answer", { from: to, to: sender, answer });
    });

    socket.on("answer", async ({ answer }) => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("icecandidate", async (candidate) => {
      try {
        if (pc.current) {
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("❌ Failed to add ICE candidate", err);
      }
    });

    socket.on("call-rejected", cleanup);
    socket.on("user-video-call-disconnect", cleanup);
    socket.on("end-call", cleanup);

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("icecandidate");
      socket.off("call-rejected");
      socket.off("user-video-call-disconnect");
      socket.off("end-call");
    };
  }, []);

  const cleanup = () => {
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setLocalStreamURL(null);
    setRemoteStream(null);
    setRemoteStreamURL(null);
    setIsCalling(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>WebRTC Test Page</Text>
      <View style={styles.videoRow}>
        {localStreamURL && (
          <RTCView style={styles.video} streamURL={localStreamURL} />
        )}
        {remoteStreamURL && (
          <RTCView style={styles.video} streamURL={remoteStreamURL} />
        )}
      </View>
      <Button title="Start Call" onPress={startCall} disabled={isCalling} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  heading: { color: '#fff', textAlign: 'center', fontSize: 20, marginBottom: 20 },
  videoRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 },
  video: { width: '45%', height: 200, backgroundColor: 'gray' },
});

export default WebRTCComponentCopy;
