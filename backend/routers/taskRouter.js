const express = require('express');
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController';

const taskRouter = express.Router();

// Get all tasks
taskRouter.get('/', getAllTasks);

// Get a task by id
taskRouter.get('/:id', getTaskById);

// Create a task
taskRouter.post('/', createTask);

// Update a task
taskRouter.put('/:id', updateTask);

// Delete a task
taskRouter.delete('/:id', deleteTask);

module.exports = taskRouter;

