// SocketContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("User");
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (err) {
        console.log("Error loading user:", err);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    socketRef.current = io(process.env.EXPO_PUBLIC_API_SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      transports: ["websocket"],
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to server', currentUser.userID);
    });
    socketRef.current.on('disconnect', () => setIsConnected(false));

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentUser?.userID) {
      socketRef.current.emit("setOnline", { userID: currentUser.userID });
    }
  }, [currentUser])


  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

export default { SocketContext, SocketProvider, useSocket };