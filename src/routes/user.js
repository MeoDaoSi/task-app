const express = require('express');
const router = new express.Router();
const User = require('../models/users')
const auth = require('../middleware/auth');
const multer = require('multer');

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

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/me', auth , async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    try {
        const user = await User.findById(req.user._id);
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
})

const upload = multer({
    limits: 1000000,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
})

router.post('/users/me/photo', auth, upload.single('photo'), async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(404).send({error: error.message});
});

router.delete('/users/me/photo', auth, upload.single('photo'), async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/photo', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if ( !user || !user.avatar ){
            throw new Error();
        }
        res.set("Content-Type","image/png");
        res.send(user.avatar);
    } catch (error) {
        res.status(500).send({error: error.message});
    }
})

module.exports = router;