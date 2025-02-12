import express from 'express';
import { createProject, getAllProjects, getAllProjectsByOrg, getProjectById, changeTitle, changeDescription, changeDeadline, addEmployee, removeEmployee, addTask, removeTask, updateTaskStatus, updateStatus } from '../controllers/projectController.js';
import { checkUserRole } from '../middleware/checkUserRoleMiddleware.js';

const projectRouter = express.Router();

// Get all projects
projectRouter.get('/', getAllProjects);

// GET: List all Projects in an Organization
projectRouter.get('/org/:org', getAllProjectsByOrg);

// Get project by id
projectRouter.get('/projectId/:projectId', getProjectById);

// Create new project
projectRouter.post('/', checkUserRole('manager'), createProject);

// Change project name
projectRouter.put('/change-title/projectId/:projectId/newTitle/:newTitle', checkUserRole('manager'), changeTitle);

// Change project description
projectRouter.put('/change-description/projectId/:projectId/newDescription/:newDescription', checkUserRole('manager'), changeDescription);

// Change project deadline
projectRouter.put('/change-deadline/projectId/:projectId/newDeadline/:newDeadline', checkUserRole('manager'), changeDeadline);

// Add an employee
projectRouter.put('/projectId/:projectId/employees/add/employeeId/:employeeId', checkUserRole('manager'), addEmployee);

// Remove an Employee
projectRouter.put('/projectId/:projectId/employees/remove/employeeId/:employeeId', checkUserRole('manager'), removeEmployee);

// Add a task
projectRouter.post('/projectId/:projectId/tasks/add', checkUserRole('manager'), addTask);

// Remove a task
projectRouter.put('/projectId/:projectId/tasks/remove/taskId/:taskId', checkUserRole('manager'), removeTask);

// Update a task's status ['New', 'In Progress', 'Completed']
projectRouter.put('/projectId/:projectId/tasks/taskId/:taskId/status/:status', updateTaskStatus);

// Update the projects status ['New', 'In Progress', 'Completed']
projectRouter.put('/projectId/:projectId/status/:status', updateStatus);

export default projectRouter;