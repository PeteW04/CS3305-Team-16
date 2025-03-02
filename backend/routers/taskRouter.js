import express from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, updateTaskStatus, deleteTask, getTasksByUser, getTasksByUserID } from '../controllers/taskController.js';

const taskRouter = express.Router();

// Get all tasks
taskRouter.get('/', getAllTasks);

// Get tasks by user
taskRouter.get('/userTasks', getTasksByUser);

taskRouter.get('/userTasksID/:userId', getTasksByUserID);

// Get a task by id
taskRouter.get('/:id', getTaskById);

// Update a task
taskRouter.put('/:id', updateTask);

// Update a tasks status
taskRouter.put('/status/:id', updateTaskStatus);

// Delete a task
taskRouter.delete('/:id', deleteTask);

export default taskRouter;

