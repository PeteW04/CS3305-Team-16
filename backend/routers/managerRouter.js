import express from 'express';
import { inviteEmployee } from '../controllers/userController';
const managerRouter = express.Router();

userRouter.post('/invite-employee', inviteEmployee);

export default managerRouter;