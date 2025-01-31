const express = require('express');
import { createProject, getAllProjects, getProjectById, addEmployee, addTask, updateTaskStatus, updateStatus } from '../controllers/projectController.js';
import { checkUserRole } from '../middleware/checkUserRoleMiddleware.js';

const projectRouter = express.Router();

// Get all projects
projectRouter.get('/', getAllProjects);

// GET: List all Projects in an Organization
projectRouter.get('/:org', getAllProjects);

// Get project by id
projectRouter.get('/:id', getProjectById);

// Create new project
projectRouter.post('/', checkUserRole('manager'), createProject);

// Change project name
projectRouter.put('/:title',  checkUserRole('manager'), addEmployee);

// Change project description
projectRouter.put('/:description',  checkUserRole('manager'), addEmployee);

// Change project deadline
projectRouter.put('/:deadline',  checkUserRole('manager'), addEmployee);

// Add an employee
projectRouter.put('/:projectId/employees/add/:employeeId',  checkUserRole('manager'), addEmployee);

// Remove an Employee
projectRouter.put('/:projectId/employees/remove/:employeeId',  checkUserRole('manager'), addEmployee);

// Add a task
projectRouter.put('/:projectId/tasks/add/:taskId',  checkUserRole('manager'), addTask);

// Remove a task
projectRouter.put('/:projectId/tasks/remove/:taskId',  checkUserRole('manager'), addTask);

// Update a task's status ['New', 'In Progress', 'Completed']
projectRouter.put('/:projectId/tasks/:taskId/:status', updateTaskStatus);

// Update the projects status ['New', 'In Progress', 'Completed']
projectRouter.put('/:projectId/:status', updateStatus);

export default projectRouter;