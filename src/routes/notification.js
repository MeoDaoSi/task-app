const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const Notification = require('../models/notifications')

router.post('/notification', auth, async (req, res) => {
    const {taskId} = req.body;
    try {
        notification = new Notification({
            user: req.user._id,
            task: taskId
        });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json();
    }
})

router.get('/notification', auth, async (req, res) => {
    try {
        const notification = await Notification.find({user: req.user._id});
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json();
    }
})

module.exports = router;