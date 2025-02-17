import { io } from "socket.io-client";
import { getAuthToken } from "./token";

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false,
    query: {
        token: getAuthToken(),
    },
});

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
});

socket.on("disconnect", () => {
    console.log("Socket disconnected");
});


export default socket;
