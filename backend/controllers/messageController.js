import Message from "../models/Message.js";
import Channel from "../models/Channel.js";


export const getChannels = async (req, res) => {
    try {
        const userId = req.user.id;

        const channels = await Channel.find({ members: userId })
            .populate("members", "firstName lastName email")
            .populate("projectId", "name")
            // Add this populate for latest message
            .populate({
                path: 'latestMessage.senderId',
                select: 'firstName lastName'
            });

        // Get unread counts for each channel
        const channelsWithCounts = await Promise.all(channels.map(async (channel) => {
            const unreadCount = await Message.countDocuments({
                channelId: channel._id,
                senderId: { $ne: userId },
                readBy: { $nin: [userId] }
            });

            const latestMessage = await Message.findOne({ channelId: channel._id })
                .sort({ createdAt: -1 })
                .populate('senderId', 'firstName lastName');

            return {
                ...channel.toObject(),
                unreadCount,
                latestMessage
            };
        }));

        const updatedChannels = channelsWithCounts.map((channel) => {
            if (channel.type === "direct-message") {
                const otherMember = channel.members.find(
                    (member) => member._id.toString() !== userId
                );

                channel.name = otherMember
                    ? `${otherMember.firstName} ${otherMember.lastName}`
                    : "Unknown User";
            }

            return channel;
        });

        res.status(200).json(updatedChannels);
    } catch (error) {
        console.error("Error in getChannels:", error.message);
        res.status(500).json({ message: "Failed to fetch channels" });
    }
};



export const createChannel = async (req, res) => {
    const { type, members, name, projectId } = req.body;
    const { id } = req.user;

    try {
        if (type === "direct-message" && members.length !== 2) {
            return res.status(400).json({ message: "Direct-message channels must have exactly two members" });
        }

        if ((type === "group" || type === "project") && !name) {
            return res.status(400).json({ message: "Group and Project channels must have a name" });
        }
        members.push(id);
        const channel = await Channel.create({ type, members, name, projectId });

        return res.status(201).json(channel);
    } catch (e) {
        console.error("Error in createChannel:", e.message);
        return res.status(500).json({ message: e.message });
    }
};



export const editChannel = async (req, res) => {
    const { channelId } = req.params;
    const { name, members, type, projectId } = req.body;
    try {
        const updatedChannel = await Channel.findByIdAndUpdate(
            channelId,
            { name, members, type, projectId },
            { new: true }
        );

        if (!updatedChannel) {
            return res.status(404).json({ message: "Channel not found" });
        }
        req.io.to(channelId).emit("channelUpdated", updatedChannel);
        return res.status(200).json(updatedChannel);
    } catch (e) {
        console.error("Error in editChannel:", e.message);
        return res.status(500).json({ message: e.message });
    }
};


export const deleteChannel = async (req, res) => {
    const { channelId } = req.params;
    try {
        const channel = await Channel.findByIdAndDelete(channelId);
        if (!channel) {
            return res.status(404).json({ message: "Channel not found!" })
        }
        await Message.deleteMany({ channelId });
        req.io.emit("channelDeleted", { channelId });
        return res.status(200).json({ message: "Channel Deleted" });
    } catch (e) {
        console.error("Error in deleteChannel:", e.message);
        return res.status(500).json({ message: e.message });
    }
};

export const getMessages = async (req, res) => {
    const { channelId } = req.params;
    try {
        const messages = await Message.find({ channelId })
            .populate('senderId', 'firstName lastName')
            .populate('readBy', 'firstName lastName'); // Add readBy population
        return res.status(200).json(messages);
    } catch (e) {
        console.error("Error in getMessages:", e.message);
        return res.status(500).json({ message: e.message });
    }
};



export const sendMessage = async (req, res) => {
    const { channelId, text } = req.body;

    try {
        let message = await Message.create({
            channelId,
            senderId: req.user._id,
            text,
            readBy: [req.user._id]
        });
        message = await message.populate('senderId', 'firstName lastName _id');

        await Channel.findByIdAndUpdate(channelId, {
            latestMessage: {
                text,
                createdAt: new Date(),
                senderId: req.user._id
            }
        });

        req.io.to(channelId).emit('newMessage', message);
        return res.status(201).json(message);
    } catch (e) {
        console.error("Error in sendMessage:", e.message);
        return res.status(500).json({ message: e.message });
    }
};

export const editMessage = async (req, res) => {
    const { messageId } = req.params;
    const { text } = req.body;

    try {
        const message = await Message.findByIdAndUpdate(messageId, { text, editedAt: new Date() }, { new: true });
        if (!message) {
            return res.status(404).json({ message: "Chat not found" });
        }
        req.io.to(message.channelId).emit("messageUpdated", message);
        return res.status(200).json(message);
    } catch (e) {
        console.error("Error in editMessage:", e.message);
        res.status(500).json({ error: e.message })
    }
};


export const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    try {
        const message = await Chat.findByIdAndDelete(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        req.io.to(message.channelId).emit('messageDelted', { messageId });
        return res.status(200).json({ message: "Message Deleted" });
    } catch (e) {
        console.error("Error in deleteMessage:", e.message);
        return res.status(500).json({ message: e.message });
    }
}


export const markMessagesRead = async (req, res) => {
    const { channelId } = req.params;
    try {
        const updatedMessages = await Message.find({
            channelId,
            senderId: { $ne: req.user._id },
            readBy: { $nin: [req.user._id] }
        }).populate('senderId', 'firstName lastName _id');

        if (updatedMessages.length > 0) {
            await Message.updateMany(
                { _id: { $in: updatedMessages.map(msg => msg._id) } },
                { $addToSet: { readBy: req.user._id } }
            );

            const populatedMessages = await Message.find(
                { _id: { $in: updatedMessages.map(msg => msg._id) } }
            ).populate('senderId', 'firstName lastName')
                .populate('readBy', 'firstName lastName');

            req.io.to(channelId).emit('messagesRead', {
                channelId,
                messages: populatedMessages
            });

            res.status(200).json({
                success: true,
                channelId,
                messages: populatedMessages
            });
        } else {
            res.status(200).json({ success: true, channelId });
        }
    } catch (e) {
        console.error("Error in markMessagesRead:", e.message);
        res.status(500).json({ message: e.message });
    }
};
