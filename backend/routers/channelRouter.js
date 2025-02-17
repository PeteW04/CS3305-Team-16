import express from 'express';
import { getMessages, createChannel, editChannel, deleteChannel, getChannels } from '../controllers/messageController.js';

const channelRouter = express.Router();

channelRouter.get("/", getChannels);
channelRouter.get('/messages/:channelId', getMessages);
channelRouter.post('/create', createChannel); // Create a channel
channelRouter.put('/edit/:channelId', editChannel); // Edit a channel
channelRouter.delete('/delete/:channelId', deleteChannel); // Delete a channel

export default channelRouter;