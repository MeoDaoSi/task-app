const mongoose = require('mongoose');
const validator = require('validator');

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled'
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
    favorite: {
        type: Boolean,
        default: false
    },
    favoritePosition: {
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

boardSchema.virtual('allSection', {
    ref: 'sections',
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