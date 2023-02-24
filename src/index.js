const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');

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

// const Task = require('./models/task')

// const main = async () => {
//     const task = await Task.findById('63f6d5fef2621a4617fa3981').populate('owner').exec( (err, task) => {
//         console.log(task.owner);
//     });
// }

// main();