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

const animes = {
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 8.5,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'George R. R. Martin',
}

animes.toJSON = function (req, res) {
    return {}
};

console.log(JSON.stringify(animes));