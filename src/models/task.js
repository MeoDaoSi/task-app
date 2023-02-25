const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique : true
    },
    description: {
        type: String,
        required: false,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    priority: {
        type: Number,
        default: 0
    },
    // assignee: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: false
    // },
    dueDate: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
})

const Task = mongoose.model('tasks',taskSchema);

module.exports = Task;