import express from 'express';
import { createProject, getAllProjects, getAllProjectsByOrg, getProjectById, getTasks, updateProject, addEmployee, removeEmployee, addTask, removeTask, updateTaskStatus, updateStatus, deleteProject, getProjectsByUser } from '../controllers/projectController.js';
import { checkUserRole } from '../middleware/checkUserRoleMiddleware.js';

const projectRouter = express.Router();

// Get all projects
projectRouter.get('/', getAllProjects);

// GET: List all Projects in an Organization
projectRouter.get('/org/:org', getAllProjectsByOrg);

// Get project by id
projectRouter.get('/projectId/:projectId', getProjectById);

// Get all tasks from a project
projectRouter.get('/:projectId/tasks', getTasks);

// Get projects by user
projectRouter.get('/user/:userId', getProjectsByUser);

// Create new project
projectRouter.post('/', checkUserRole('manager'), createProject);

// Update Project
projectRouter.put('/:id', checkUserRole('manager'), updateProject);

// Add an employee
projectRouter.put('/employees/add', checkUserRole('manager'), addEmployee);

// Remove an Employee
projectRouter.put('/projectId/:projectId/employees/remove/employeeId/:employeeId', checkUserRole('manager'), removeEmployee);

// Add a task
projectRouter.post('/projectId/:projectId/tasks/add', checkUserRole('manager'), addTask);

// Remove a task
projectRouter.delete('/projectId/:projectId/tasks/remove/taskId/:taskId', removeTask);

// Update a task's status ['New', 'In Progress', 'Completed']
projectRouter.put('/projectId/:projectId/tasks/taskId/:taskId/status/:status', updateTaskStatus);

// Update the projects status ['New', 'In Progress', 'Completed']
projectRouter.put('/projectId/:projectId/status/:status', updateStatus);

// Delete a project
projectRouter.delete('/:id', checkUserRole('manager'), deleteProject);

export default projectRouter;