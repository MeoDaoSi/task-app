const mongoose = require('mongoose');
const validator = require('validator');

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique : true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

boardSchema.virtual('alltask', {
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