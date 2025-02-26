import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
    type: { type: String, enum: ["direct-message", "group", "project"], required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    name: { type: String },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    latestMessage: {
        text: String,
        createdAt: Date,
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }
});

export default mongoose.model('Channel', channelSchema);