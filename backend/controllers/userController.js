import User from '../models/User.js';
import { hashPassword } from '../utils/passwordHash.js';

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

export const changePassword = async (req, res) => {
    const { Password } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedNewPassword = await hashPassword(Password);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (e) {
        console.error("Error in changePassword:", e.message);
        return res.status(500).json({ message: e.message });
    }
};