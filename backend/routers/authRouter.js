import express from 'express';
import { registerManager, login, validateToken, forgotPassword, resetPassword } from '../controllers/authController.js';

const authRouter = express.Router()

authRouter.post('/register-manager', registerManager);
authRouter.post('/login', login)
authRouter.get('/validate', validateToken);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter;