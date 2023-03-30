const mongoose = require('mongoose');
const validator = require('validator');

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'undefine'
    },
    description: {
        type: String,
        default: `Add description here
        + You can add multiline description
        + Let's start...`
    },
    position: {
        type: Number
    },
    favourite: {
        type: Boolean,
        default: false
    },
    favouritePosition: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
}, {
    timestamps: true
})

boardSchema.virtual('allTask', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'board'
})

boardSchema.pre('deleteMany', async function(next){
    const board = this;
    await Task.deleteMany({owner: board._id});
    next();
})

const Board = mongoose.model('boards',boardSchema);

module.exports = Board;