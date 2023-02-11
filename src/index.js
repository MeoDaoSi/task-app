const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000

const db = require('./db/mongoose.js')
mongoose.set("strictQuery", false);
db.connect();
const User = require('./models/users.js')
app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);
    console.log(user);
    user.save()
        .then(()=> {
            res.send(user)
        })
        .catch((e)=>{
            res.status(400).send(e)
        })
})

app.listen(port, () => {
    console.log('Connect successfully!');
});