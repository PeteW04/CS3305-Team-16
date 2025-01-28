import express from 'express';
import { registerManager, login, inviteEmployee, registerEmployee } from '../controllers/authController.js';

const authRouter = express.Router()

authRouter.post('/register-manager', registerManager);
authRouter.post('/login', login)
authRouter.post('/invite-employee', inviteEmployee);
authRouter.post('/register-employee', registerEmployee);

export default authRouter;