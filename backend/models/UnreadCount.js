// models/UnreadCount.js
import mongoose from 'mongoose';

const unreadCountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    lastReadAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Compound index for faster queries
unreadCountSchema.index({ userId: 1, channelId: 1 }, { unique: true });

export default mongoose.model('UnreadCount', unreadCountSchema);
