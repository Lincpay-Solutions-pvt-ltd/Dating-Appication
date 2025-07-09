// socket.js
import { io } from "socket.io-client";

// Replace with your backend URL
const SOCKET_URL = "http://192.168.0.103:5000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"], 
  reconnection: true,
  autoConnect: false,
});

export default socket;
