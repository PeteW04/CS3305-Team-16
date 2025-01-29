const express = require('express');
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';

const userRouter = express.Router();

// Get all users
userRouter.get('/', getAllUsers);

// Get a user by id
userRouter.get('/:id', getUserById);

// Create a user
userRouter.post('/', createUser);

// Update a user
userRouter.put('/:id', updateUser);

// Delete a user
userRouter.delete('/:id', deleteUser);

module.exports = userRouter;