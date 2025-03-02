import User from '../models/User.js';
import { hashPassword } from '../utils/passwordHash.js';

// Get all users
export const getAllUsers = async (req, res) => {
  const { organizationId } = req.user;
  try {
    const users = await User.find({ organizationId }).select("firstName lastName email _id");
    return res.status(200).json(users);
  }
  catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get a user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  }
  catch (error) {
    console.error("Error fetching user by ID:", error.message);
    return res.status(500).json({ message: "Failed to fetch user by ID" });
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

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userObj = user.toObject();
    if (userObj.profilePicture && userObj.profilePicture.data) {
      userObj.profilePicture = `data:${userObj.profilePicture.contentType};base64,${userObj.profilePicture.data.toString('base64')}`;
    }
    res.json(userObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const buffer = req.file.buffer;
    const contentType = req.file.mimetype;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: { data: buffer, contentType: contentType } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userObj = user.toObject();
    if (userObj.profilePicture && userObj.profilePicture.data) {
      userObj.profilePicture = `data:${userObj.profilePicture.contentType};base64,${userObj.profilePicture.data.toString('base64')}`;
    }

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
