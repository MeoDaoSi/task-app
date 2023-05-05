const express = require('express');
const router = express.Router();
const Task = require('../models/tasks')
const auth = require('../middleware/auth');
const User = require('../models/users');
const Board = require('../models/boards');
const Section = require('../models/sections');

router.post('/tasks', auth, async (req, res) => {
    const { sectionId } = req.body;
    try {
        const tasksCount = await Task.find({ section: sectionId }).count();
        const task = new Task({
            section: sectionId,
            priority: tasksCount > 0 ? tasksCount : 0
        });
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

router.patch('/tasks', auth, async (req, res) => {
    // const updates = Object.keys(req.body);
    // const allowedUpdates = ['title', 'description', 'completed', 'priority', 'dueDate'];
    // const isMatchUpdate = updates.every((update) => allowedUpdates.includes(update));
    // if (!isMatchUpdate) {
    //     return res.status(400).json();
    // }
    const {
        sourceList,
        destList,
        sourceSectionId,
        destSectionId
    } = req.body
    try {
        // const _id = req.params.id;
        // const task = await Task.findOne({ _id, owner: req.user._id });
        // if (!task) {
        //     return res.status(404).json();
        // }
        // updates.forEach((update) => task[update] = req.body[update]);
        // task.save();
        // res.status(200).json(task);
        if ( sourceSectionId !== destSectionId ){
            for ( let key in sourceList ){
                await Task.findOneAndUpdate(
                    { _id: sourceList[key] },
                    { 
                        section: sourceSectionId,
                        priority: key
                    }
                );
            }
            for ( let key in destList ){
                await Task.findOneAndUpdate(
                    { _id: destList[key] },
                    { 
                        section: destSectionId,
                        priority: key
                    }
                );
            }
        }
        res.status(200).json();
    } catch (e) {
        res.status(500).json();
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id ;
    const update = Object.keys(req.body);
    const key = update[0];

    const date = new Date(req.body[key]);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    // const dateString = date.toLocaleDateString();
    const dateString = `${year}-${month}-${day}`;
    console.log(date);
    try {
        const task = await Task.findOne({ _id })
        if(!task){
            res.status(404).json();
        }
        task[key] = dateString;
        task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json();
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id ;
    try {
        const task = await Task.findOneAndDelete({ _id })
        if(!task){
            res.status(404).json();
        }
        res.json(task);
    } catch (error) {
        res.status(500).json();
    }
})

module.exports = router