import express from 'express';
import { sendMessage, editMessage, deleteMessage, getMessages } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.post('/send', sendMessage);
messageRouter.put('/:messageId', editMessage);
messageRouter.delete('/:id', deleteMessage);
messageRouter.get('/:channelId', getMessages);

export default messageRouter;
