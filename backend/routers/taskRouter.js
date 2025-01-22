const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Read all tasks
router.get('/', async (req, res) => {
    try{
        const tasks = await Task.find({});
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Read a task
router.get('/:id', async (req, res) => {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({error: 'Task not found'});
        }   
});

// Create a task
router.post('/', async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(updatedTask);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
        
});

module.exports = router;

