const express = require('express');
const router = express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth');
const User = require('../models/users');

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

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send();
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        if (parts.length === 2) {
            sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
        }
    }
    try {
        await User.find({ _id: req.user._id }).populate({
            path: 'allTask',
            match,
            options: {
                limit: parseInt(req.query.limit) || undefined,
                skip: parseInt(req.query.skip) || undefined,
                sort
            }
        }).exec((error,task)=>{
            res.status(200).send(task[0].allTask);
        });
    } catch (e) {
        res.status(500).send();
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'completed', 'priority', 'dueDate'];
    const isMatchUpdate = updates.every((update) => allowedUpdates.includes(update));
    if (!isMatchUpdate) {
        return res.status(400).send();
    }
    try {
        const _id = req.params.id;
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        task.save();
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send();
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id ;
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id})
        if(!task){
            res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router