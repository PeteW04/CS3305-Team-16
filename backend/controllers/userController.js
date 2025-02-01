import crypto from 'crypto';
import User from '../models/User.js';
import Invite from '../models/Invite.js';
import Organization from '../models/Organization.js';
import { sendEmail } from "../utils/email.js";


// Get all users
export const getAllUsers = async () => {
    try {
        const users = await User.find({});
        console.log(`Users: ${users}`);

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a user by id
export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    }
};

// Create a user
export const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const inviteEmployee = async (req, res) => {
    const { email } = req.body;
    const organizationId = req.user.organizationId;
    const organization = await Organization.findById(organizationId);
    try {
        const doesUserExist = await User.findOne({ email });
        if (doesUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        const invite = await Invite.create({ email, token, expires, organizationId });
        const link = `http://localhost:3000/employeeSignup?token=${token}`
        const subject = `You have been invited to join ${organization.name}!`
        const html = `
            <p>Hello,</p>
            <p>You have been invited to join ${organization.name}'s workspace. Click the link below to accept the invitation:</p>
            <a href="${link}">Accept Invitation</a>
            <p>The link will expire in 7 days.</p>
        `
        await sendEmail(email, subject, html);

        return res.status(200).json({ message: "Invite sent successfully" });
    } catch (e) {
        console.error("Error adding employee: ", e.message);
        return res.status(500).json({ message: "Error adding employee" })
    }
}