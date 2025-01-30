import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);