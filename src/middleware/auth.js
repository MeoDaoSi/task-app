const User = require('../models/users');
const jwt = require('jsonwebtoken');
const auth = async (req, res, next) => {
    try {
        const token = await req.header('authorization').replace('Bearer ','');
        const decoded = jwt.verify(token, 'meodaosi');
        const user = await User.findOne({ _id:decoded._id, "tokens.token": token } );
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error : 'Please authenticate' });
    }
}

module.exports = auth;