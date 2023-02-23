const express = require('express');
const router = express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router