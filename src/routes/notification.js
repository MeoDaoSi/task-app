const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const Notification = require('../models/notifications')

router.post('/notifications', auth, async (req, res) => {
    const {taskId,content} = req.body;
    console.log(content);
    console.log(taskId);
    try {
        notification = new Notification({
            content: content,
            user: req.user._id,
            task: taskId
        });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json();
    }
})

router.get('/notifications', auth, async (req, res) => {
    try {
        const notification = await Notification.find({user: req.user._id});
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json();
    }
})

router.delete('/notifications/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        await Notification.findOneAndRemove({ _id});
        res.status(200).json();
    } catch (error) {
        res.status(500).json();
    }
})

module.exports = router;