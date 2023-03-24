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
        await User.find({_id: req.user._id}).populate({
            path: 'allBoard',
        }).exec((error,board)=>{
            res.status(200).json(board[0].allBoard);
        })
        
        // await User.find({'_id': req.user._id}).populate({
        //     path: 'allBoard'
        // }).exec( (error, board)=> {
        //     res.status(200).json(board);
        // })
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router