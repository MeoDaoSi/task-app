const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000

// connect db
const db = require('./db/mongoose.js')
mongoose.set("strictQuery", false);
db.connect();

app.use(express.json());
// routes
app.use(userRoute);
app.use(taskRoute);

app.listen(port, () => {
    console.log('Connect successfully!');
});

const images = multer({
    dest: "images"
})

app.post('/upload', images.single('file'), (req, res) => {
    console.log(req.file);
    res.send(req.file);
})