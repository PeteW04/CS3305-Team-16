import User from '../models/User';


// Get all users
export const getAllUsers = async (req, res) => {
    try{
        const users = await User.find({});
        res.json(users);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get a user by id
export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).json({error: 'User not found'});
    }
};

// Create a user
export const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({error: error.message});
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