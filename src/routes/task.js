const express = require('express');
const router = express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth');
const User = require('../models/users');
const Board = require('../models/boards');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json();
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).json();
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json();
    }
})

router.get('/tasks', auth, async (req, res) => {
    // lay du lieu tu thanh dia chi
    const limit = req.query.limit;
    const skip = req.query.skip;
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
        await Board.find({ _id: req.user._id }).populate({
            path: 'allTask',
            match,
            options: {
                limit: parseInt(limit) || undefined,
                skip: parseInt(skip) || undefined,
                sort
            }
        }).exec((error,task)=>{
            res.status(200).json(task[0].allTask);
        });
    } catch (e) {
        res.status(500).json();
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'completed', 'priority', 'dueDate'];
    const isMatchUpdate = updates.every((update) => allowedUpdates.includes(update));
    if (!isMatchUpdate) {
        return res.status(400).json();
    }
    try {
        const _id = req.params.id;
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).json();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        task.save();
        res.status(200).json(task);
    } catch (e) {
        res.status(500).json();
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id ;
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id})
        if(!task){
            res.status(404).json();
        }
        res.json(task);
    } catch (error) {
        res.status(500).json();
    }
})

module.exports = router