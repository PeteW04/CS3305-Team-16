import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, inviteEmployee } from '../controllers/userController.js';

const userRouter = express.Router();

// Get all users
userRouter.get('/', getAllUsers);

// Get a user by id
userRouter.get('/:id', getUserById);

// Create a user
userRouter.post('/invite-employee', inviteEmployee);

// Update a user
userRouter.put('/:id', updateUser);

// Delete a user
userRouter.delete('/:id', deleteUser);


export default userRouter;