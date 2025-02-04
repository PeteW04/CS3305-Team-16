import express from 'express';
import { createChannel, editChannel, deleteChannel } from '../controllers/messageController.js';

const channelRouter = express.Router();

channelRouter.post('/create', createChannel); // Create a channel
channelRouter.put('/edit/:channelId', editChannel); // Edit a channel
channelRouter.delete('/delete/:channelId', deleteChannel); // Delete a channel

export default channelRouter;