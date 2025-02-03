export const socketAuthentication = (socket, next) => {
    const token = socket.handshake.auth.token; // Pass the token during WebSocket handshake
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = user; // Attach user info to the socket object
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
};
