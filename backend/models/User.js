import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["manager", "employee"], default: "employee" },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
});

export default mongoose.model('User', userSchema);

