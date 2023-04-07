const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const authAdmin = require('../middleware/authAdmin');

router.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findOne({username:req.body?.username,password:req.body?.password});
        const token = await admin.generateAuthToken();
        res.status(200).json({admin, token});
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get('/admin/me', authAdmin, async (req, res)=> {
    res.json(req.admin);
})

router.post('/admin/logout', authAdmin, async (req, res) => {
    const tokenAdmin = req.token;
    try {
        req.admin.tokens = req.admin.tokens.filter( token => token.token !== tokenAdmin );

        await req.admin.save();
        res.status(200).json();
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router