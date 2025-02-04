import express from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { checkUserRole } from '../middleware/checkUserRoleMiddleware.js';

const taskRouter = express.Router();

// Get all tasks
taskRouter.get('/', getAllTasks);

// Get a task by id
taskRouter.get('/:id', getTaskById);

// Create a task
taskRouter.post('/', checkUserRole('manager'), createTask);

// Update a task
taskRouter.put('/:id', checkUserRole('manager'), updateTask);

// Delete a task
taskRouter.delete('/:id', checkUserRole('manager'), deleteTask);

export default taskRouter;

