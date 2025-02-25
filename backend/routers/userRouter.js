import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, changePassword, getUserProfile } from '../controllers/userController.js';

const userRouter = express.Router();

// Get all users
userRouter.get('/', getAllUsers);

userRouter.post('/change-password', changePassword);

userRouter.get('/profile', getUserProfile);

// Get a user by id
userRouter.get('/:id', getUserById);

// Update a user
userRouter.put('/:id', updateUser);

// Delete a user
userRouter.delete('/:id', deleteUser);


export default userRouter;