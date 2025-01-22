const express = require('express');
const router = express.Router();

// Read all tasks
router.get('/', (req, res) => {
    try{
        res.send('Get all tasks');
    }
    catch (error) {
        res.status(500).send();
    }
});

// Read a task
router.get('/:id', (req, res) => {
        const taskIndex = getIndexById(req.params.id, tasks);
        if (task) {
            res.send('Got one task');
        } else {
            res.status(404).send();
        }    
});

// Create a task
router.post('/', (req, res) => {
    const newTask = req.query;
    if (newTask) {
        res.send('Task created');
    } else {
        res.status(400).send();
    }
});

// Update a task
router.put('/:id', (req, res) => {
    const taskIndex = getIndexById(req.params.id, tasks);
    if (taskIndex !==- 1) {
        updateElementById(req.params.id, req.query, tasks);
        res.send('Task updated');
    } else {
        res.status(404).send();
    }
});

// Delete a task
router.delete('/:id', (req, res) => {
    const taskIndex = getIndexById(req.params.id, tasks);
    if (taskIndex !== -1) {
        deleteElementById(req.params.id, tasks);
        res.status(204).send('Task deleted');
    } else {
        res.status(404).send();
    }
});

