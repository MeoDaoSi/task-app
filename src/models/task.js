const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: false,
    },
    completed: {
        type: Boolean,
        default: false
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sections',
        required: true
    },
    priority: {
        type: Number,
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    dueDate: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
})

const Task = mongoose.model('tasks',taskSchema);

module.exports = Task;