import express from 'express';
import { registerManager, login, validateToken } from '../controllers/authController.js';

const authRouter = express.Router()

authRouter.post('/register-manager', registerManager);
authRouter.post('/login', login)
authRouter.get('/validate', validateToken);

export default authRouter;