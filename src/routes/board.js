const express = require('express');
const router = express.Router();
const Task = require('../models/task')
const auth = require('../middleware/auth');
const User = require('../models/users');
const Board = require('../models/boards')

router.post('/boards', auth, async function (req, res) {
    const board = new Board({
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
            options: {
                sort: {
                    position: 1
                }
            }
        }).exec((error,board)=>{
            res.status(200).json(board.allBoard);
        })
    } catch (error) {
        res.status(500).json(error);
    }
})

router.patch('/boards', auth, async function (req, res) {
    const {boards} = req.body;
    try {
        for ( let key in boards ){
            const board = boards[key];
            await Board.findOneAndUpdate(
                { _id: board._id },
                { 
                    position: key
                });
        }
        res.status(200).json();
    } catch (error) {
        res.status(400).json(error);
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
    const update = Object.keys(req.body);
    const [key] = update;
    const _id = req.params.id;
    try {
        const board = await Board.findOne({ _id, owner: req.user._id });
        if (!board) {
            return res.status(404).json();
        } 
        board[key] = req.body[key];
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