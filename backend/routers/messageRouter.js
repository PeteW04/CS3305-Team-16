import express from 'express';
import { sendMessage, editMessage, deleteMessage, getMessages } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.post('/send', sendMessage);
messageRouter.put('/edit/:messageId', editMessage);
messageRouter.delete('/delete/:messageId', deleteMessage);

export default messageRouter;
