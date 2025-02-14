import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, changePassword, forgotPassword, resetPassword } from '../controllers/userController.js';

const userRouter = express.Router();

// Get all users
userRouter.get('/', getAllUsers);

// Get a user by id
userRouter.get('/:id', getUserById);

// Update a user
userRouter.put('/:id', updateUser);

// Delete a user
userRouter.delete('/:id', deleteUser);

userRouter.post('/change-password', changePassword);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);


export default userRouter;