import Chat from "../models/Chat";
import Channel from "../models/Channel";


export const createChannel = async (req, res) => {
    const { type, members, name, projectId } = req.body;
    try {
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



export const getMessages = async (req, res) => {
    const { channelId } = req.body;
    try {
        const messages = await MessageChannel.find({ channelId });
        return res.status(200).json(messages);
    } catch (e) {
        console.error("Error in getMessages:", e.message);
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
        await Chat.deleteMany({ channelId });
        req.io.emit("channelDeleted", { channelId });
        return res.status(200).json({ message: "Channel Deleted" });
    } catch (e) {
        console.error("Error in deleteChannel:", e.message);
        return res.status(500).json({ message: e.message });
    }
};


export const sendMessage = async (req, res) => {
    const { channelId, text } = req.body;

    try {
        const message = Chat.create({ channelId, senderId: req.user._id, text });
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
        const message = await Chat.findByIdAndUpdate(messageId, { text, editedAt: new Date() }, { new: true });
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
    const { id } = req.params;
    try {
        const message = await MessageChannel.findByIdAndDelete(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        req.io.to(message.conversationId).emit('messageDelted', { id });
        return res.status(200).json({ message: "Message Deleted" });
    } catch (e) {
        console.error("Error in deleteMessage:", e.message);
        return res.status(500).json({ message: e.message });
    }
}