const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');
const boardRoute = require('./routes/board');
const sectionRoute = require('./routes/section');
const adminRoute = require('./routes/admin');
// const notificationRoute = require('./routes/notification');

const multer = require('multer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 80

// Thiết lập CORS middleware
app.use(cors());

// connect db
const db = require('./db/mongoose.js')
mongoose.set("strictQuery", false);
db.connect();

app.use(express.json());
// routes
app.use(userRoute);
app.use(taskRoute);
app.use(boardRoute);
app.use(sectionRoute);
app.use(adminRoute);
// app.use(notificationRoute);

app.listen(port, () => {
    console.log('Connect successfully!');
});

// const images = multer({
//     dest: "images"
// })

// app.post('/upload', images.single('file'), (req, res) => {
//     console.log(req.file);
//     res.send(req.file);
// })

// const fs = require('fs');

// const dataImage = fs.readFileSync('images\\9fa8ccf940c418d1c34b5b8a79eaa42d');

// console.log(dataImage);

// const encodedImageData = dataImage.toString('base64');

// console.log(encodedImageData);

