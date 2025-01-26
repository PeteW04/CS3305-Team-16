import express from 'express';
import { registerManager, login } from '../controllers/authController.js';

const authRouter = express.Router()

router.post('/register', registerManager);
router.post('/login', login)

export default authRouter;