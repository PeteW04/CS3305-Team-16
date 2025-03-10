import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, changePassword, getUserProfile, updateProfilePicture } from '../controllers/userController.js';
import multer from 'multer';


const userRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all users
userRouter.get('/', getAllUsers);

userRouter.post('/change-password', changePassword);

userRouter.get('/profile', getUserProfile);

userRouter.post('/profile-picture', upload.single('profilePicture'), updateProfilePicture);


// Get a user by id
userRouter.get('/:id', getUserById);

// Update a user
userRouter.put('/:id', updateUser);

// Delete a user
userRouter.delete('/:id', deleteUser);


export default userRouter;