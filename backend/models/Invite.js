import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
});

export default mongoose.model('Invite', inviteSchema);