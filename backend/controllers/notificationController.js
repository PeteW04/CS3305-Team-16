import Notification from "../models/Notification.js";

// Get all notifications for current user
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-__v")
            .limit(10)
            .lean();

        return res.status(200).json({
            notifications
        });
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};

// Create notification
export const createNotification = async (userId, type, message, relatedId) => {
    try {
        const newNotification = await Notification.create({
            user: userId,
            type,
            message,
            relatedId
        });

        // Emit real-time update
        // req.io.to(req.user.id).emit('new-notification', newNotification);
    } catch (error) {
        console.error("Notification creation error:", error.message);
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id // Ensure ownership
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        // Emit deletion event
        req.io.to(req.user.id).emit('delete-notification', notification._id);

        return res.status(200).json({ id: notification._id });
    } catch (error) {
        console.error("Delete notification error:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete notification',
        });
    }
};
