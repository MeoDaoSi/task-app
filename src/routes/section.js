const express = require('express');
const router = express.Router();
const Section = require('../models/sections');
const auth = require('../middleware/auth');

router.post('/boards/:idBoard/sections', auth, async (req, res) => {
    const section = new Section({
        board: req.params.idBoard
    })
    try {
        await section.save();
        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ error: error});
    }
})

router.patch('/boards/:idBoard/sections/:idSection', auth, async (req, res) => {
    const idBoard = req.params.idBoard;
    const idSection = req.params.idSection;
    const update = Object.keys(req.body);
    const key = update[0];
    try {
        const section = await Section.findOne({
            _id: idSection,
            board: idBoard
        })
        if(!section){
            return res.status(500).json()
        }
        section[key] = req.body[key];
        res.status(200).json(section);
    } catch (error) {
        res.status(500).json();
    }
})

router.delete('/boards/:idBoard/sections/:idSection', auth, async (req, res) => {
    const idBoard = req.params.idBoard;
    const idSection = req.params.idSection;
    try {
        const section = await Section.findOne({
            _id: idSection,
            board: idBoard
        })
        if(!section){
            return res.status(500).json()
        }
        await section.remove();
        res.status(200).json();
    } catch (error) {
        res.status(500).json();
    }
})

module.exports = router;