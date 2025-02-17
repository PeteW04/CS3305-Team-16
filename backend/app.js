import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';
import projectRouter from './routers/projectRouter.js';
import taskRouter from './routers/taskRouter.js';
import channelRouter from './routers/channelRouter.js';
import messageRouter from './routers/messageRouter.js';
import { authenticate } from './middleware/authMiddleware.js';
import { socketAuthentication } from './middleware/socketMiddleware.js';
import managerRouter from './routers/managerRouter.js';

// INITIALIZATION
dotenv.config();
await connectDB();
const app = express();

// SOCKET.IO
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your frontend's URL
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    req.io = io;
    next();
});
io.use(socketAuthentication);

// ROUTERS
app.use('/auth', authRouter);
app.use('/users', authenticate, userRouter);
app.use('/manager', authenticate, managerRouter)

app.use('/project', authenticate, projectRouter);
app.use('/task', authenticate, taskRouter);

app.use('/message', authenticate, messageRouter);
app.use('/channel', authenticate, channelRouter);

// SOCKET.IO CONNECTION
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('error', (err) => {
        console.error("Socket Error:", err.message);
    });

    // Join a room for a specific channel
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Leave a room when requested
    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

console.log("Socket.IO server initialized");

// RUNNING SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));