import express from 'express';
import { inviteEmployee } from '../controllers/managerController.js';
const managerRouter = express.Router();

managerRouter.post('/invite-employee', inviteEmployee);

export default managerRouter;