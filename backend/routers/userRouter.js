const express = require('express');
import { router } from express.Router();
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';


// Get all users
router.get('/', getAllUsers);

// Get a user by id
router.get('/:id', getUserById);

// Create a user
router.post('/', createUser);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

module.exports = router;