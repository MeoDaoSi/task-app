const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const authAdmin = async (req, res, next) => {
    try {
        const token = await req.header('authentizationAdmin').replace('Bearer ','');
        const decode = jwt.verify(token,'meodaosi');
        const admin = await Admin.findOne({ _id: decode._id, "tokens.token": token });
        if (!admin) {
            throw new Error();
        }
        req.admin = admin;
        req.token = token;
        next();
    } catch (error) {
        res.status(500).json({ error: 'vui long dang nhap admin'});
    }
}

module.exports = authAdmin;