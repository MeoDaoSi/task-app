const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');

router.post('/admin/login', async (req, res) => {
    console.log('hello');
    try {
        const admin = await Admin.findOne({email:req.body?.email,password:req.body?.password});
        console.log(admin);
        const token = await admin.generateAuthToken();
        res.status(200).json({admin,token});
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router