import express from 'express';
import { getNotifications, deleteNotification } from '../controllers/notificationController.js';
const notificationRouter = express.Router()

notificationRouter.get('/', getNotifications);
notificationRouter.delete('/:id', deleteNotification)

export default notificationRouter;