const express = require('express');
const router = express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth');
const User = require('../models/users');
const Board = require('../models/boards')

router.post('/boards', auth, async function (req, res) {
    const board = new Board({
        ...req.body,
        owner: req.user._id,
    });
    try {
        await board.save();
        res.status(201).json(board);
    } catch (error) {
        res.status(400).json(error);
    }
})

router.get('/boards', auth, async function (req, res) {
    try {
        await User.findOne({_id: req.user._id}).populate({
            path: 'allBoard',
        }).exec((error,board)=>{
            res.status(200).json(board.allBoard);
        })
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get('/boards/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const board = await Board.findOne({ _id, owner: req.user._id });
        if (!board) {
            return res.status(404).json();
        }
        res.status(200).json(board);
    } catch (error) {
        res.status(500).json();
    }
})

router.patch('/boards/:id', auth, async (req, res) => {
    if( Object.keys(req.body)[0] !== 'title' || Object.keys(req.body).length > 1 ){
        return res.status(400).json();
    }
    const _id = req.params.id;
    try {
        const board = await Board.findOne({ _id, owner: req.user._id });
        if (!board) {
            return res.status(404).json();
        } 
        board['title'] = req.body['title'];
        board.save();
        res.status(200).json(board);
    } catch (e) {
        res.status(500).json();
    }
})

router.delete('/boards/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const board = await Board.findOne({_id, owner: req.user._id});
        if (!board) {
            res.status(404).json();
        }
        await board.remove();
        res.status(200).json();
    } catch (error) {
        res.status(500).json();
    }
})

module.exports = router