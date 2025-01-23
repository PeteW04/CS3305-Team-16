const express = require('express');
import { router } from express.Router();
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController';

// Get all tasks
router.get('/', getAllTasks);

// Get a task by id
router.get('/:id', getTaskById);

// Create a task
router.post('/', createTask);

// Update a task
router.put('/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

module.exports = router;

