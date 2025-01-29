const express = require('express');
import { createProject, getAllProjects, getProjectById, addEmployee, addTask, updateTaskStatus, updateStatus } from '../controllers/projectController';

const router = express.Router();

// Get all projects
router.get('/', getAllProjects);

// Get project by id
router.get('/:id', getProjectById);

// Create new project
router.post('/', createProject);

// Add an employee
router.put('/:projectId/employees/:employeeId', addEmployee);

// Add a task
router.put('/:projectId/tasks/:taskId', addTask);

// Update a task's status ['New', 'In Progress', 'Completed']
router.put('/:projectId/tasks/:taskId/:status', updateTaskStatus);

// Update the projects status ['New', 'In Progress', 'Completed']
router.put('/:projectId/:status', updateStatus);

module.export = router;