import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['task', 'message'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedId: { // ID of related task/message
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model('Notification', notificationSchema);