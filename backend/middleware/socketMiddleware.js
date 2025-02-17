import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const socketAuthentication = async (socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        return next(new Error("Authentication error: No token provided"));
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = await User.findById(decodedToken.id).select("-password");
        next();
    } catch (err) {
        console.error("Socket authentication failed:", err.message);
        next(new Error("Authentication error"));
    }
};

