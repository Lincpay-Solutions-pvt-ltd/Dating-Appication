// components/CallManager.js
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { useSocket } from '../services/SocketContext';
import { router } from "expo-router";


export default function CallManager({ currentUser }) {
    const { socket } = useSocket();

    const [incomingCall, setIncomingCall] = useState(null); // { from, chatID }

    useEffect(() => {
        if (!socket || !currentUser) return;

        socket.on('incoming-call', ({ from, chatID }) => {
            console.log('Incoming call', from, chatID);

            setIncomingCall({ from, chatID });
        });

        return () => {
            socket.off('incoming-call');
        };
    }, [socket, currentUser]);

    const acceptCall = () => {
        socket.emit('accept-call', { to: incomingCall.from, from: currentUser.userID });
        router.push({
            pathname: "../pages/VideoCallScreen",
            params: {
                caller: incomingCall.from,
                receiver: currentUser.userID,
                chatID: incomingCall.chatID,
                isCaller: false
            },
        });

        setIncomingCall(null);
    };

    const rejectCall = () => {
        socket.emit('reject-call', { to: incomingCall.from });
        setIncomingCall(null);
    };

    if (!incomingCall) return null;

    return (
        <Modal transparent visible animationType="fade">
            <View style={styles.modal}>
                <Text style={styles.text}>Incoming Call...</Text>
                <View style={styles.buttons}>
                    <Button title="Accept" onPress={acceptCall} />
                    <Button title="Reject" onPress={rejectCall} color="red" />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000088' },
    text: { fontSize: 22, marginBottom: 20, color: '#fff' },
    buttons: { flexDirection: 'row', gap: 16 }
});
