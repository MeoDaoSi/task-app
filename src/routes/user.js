const express = require('express');
const router = new express.Router();
const User = require('../models/users')
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send();
    }
})

router.get('/users/me', auth , async (req, res) => {
    res.send(req.user)
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates!' });
    }
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'user not found!' });
        }
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'user not found!' });
        }
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;