const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    content: {
        type : String,
        trim: true,
        default: 'Thong bao task sap het han'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks',
        require: true
    }
})

const Notification = mongoose.model('notifications', notificationSchema);
module.exports = Notification;