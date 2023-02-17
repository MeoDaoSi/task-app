const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');

const app = express();
const port = process.env.PORT || 3000

// connect db
const db = require('./db/mongoose.js')
mongoose.set("strictQuery", false);
db.connect();

app.use(express.json());
// routes
app.use(userRoute);

app.listen(port, () => {
    console.log('Connect successfully!');
});