const express = require('express');
const router = express.Router();

// Read all tasks
router.get('/', (req, res, next) => {
    try{
        res.send('Get all tasks');
    }
    catch (error) {
        res.status(500).send();
    }
});


