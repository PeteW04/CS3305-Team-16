import express from 'express';
import { registerManager, login, registerEmployee, validateToken } from '../controllers/authController.js';

const authRouter = express.Router()

authRouter.post('/register-manager', registerManager);
authRouter.post('/login', login)
authRouter.post('/register-employee', registerEmployee);
authRouter.post('/validate', validateToken);

export default authRouter;