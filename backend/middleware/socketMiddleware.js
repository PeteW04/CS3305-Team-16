import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const socketAuthentication = async (socket, next) => {
    const token = socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = await User.findById(decodedToken.id).select('-password');
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
};
