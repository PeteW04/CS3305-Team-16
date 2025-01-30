import Project from '../models/Projects.js';
import Task from '../models/Task.js';

// GET: List all Projects
export const getAllProjects = async (req, res) => {
    try {
        // Automatically filter by the user's organizationId
        const projects = await Project.find({ organization: req.user.organizationId });

        res.status(200).json(projects);
    }
    catch (error){
        res.status(500).json({error: error.message});
    }
};

// GET: Return a single Project based on its ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({error: 'Project not found'});
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// POST: Create a new Project within an Organization 
export const createProject = async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// PUT: Add a worker to a project
export const addEmployee = async (req, res) => {
    try {
        const { employeeId, projectId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ error: 'Invalid projectId or employeeId' });
        }

        const project = await Project.findByIdAndUpdate(
            projectId, 
            { $addToSet: { employees: employeeId } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Employee added successfully', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Add a new task to a project
export const addTask = async (req, res) => {
    try {
        const { taskId, projectId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ error: 'Invalid projectId or taskId' });
        }

        const task = await Task.findById(taskId);
        // Ensure the task exists
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const project = await Project.findByIdAndUpdate(
            projectId, 
            { $addToSet: { tasks: taskId } },
            { new: true }
        );

        // Ensure the project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Task added successfully', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Update the status of a task within the project, ['New', 'In Progress', 'Completed']
export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId, projectId, status } = req.params;

        // Check if the new status is valid
        const possibleStatus = ['New', 'In Progress', 'Completed'];
        if (!possibleStatus.includes(status)){
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Find the project and verify that it exists
        const project = await Project.findById(projectId).populate('tasks');
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the task is in the project
        const taskInProject = project.tasks.some(task => task._id.toString() === taskId);
        if (!taskInProject) {
            return res.status(404).json({ error: 'Task not found in the project' });
        }

        // Update task status
        const task = await Task.findByIdAndUpdate(
            taskId,
            { status: status },
            { new: true }
        );

        res.status(200).json({ message: 'Task status updated', task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT: Update the status the project
export const updateStatus = async (req, res) => {
    try{
        const { projectId, status } = req.params;

        // Check if the new status is valid
        const possibleStatus = ['New', 'In Progress', 'Completed'];
        if (!possibleStatus.includes(status)){
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Find the project and update its status
        const project = await Project.findByIdAndUpdate(
            projectId,
            { status: status },
            { new: true }
        );

        // Verify that the updated project exists
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project status updated', project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};