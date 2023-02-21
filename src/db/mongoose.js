const mongoose = require('mongoose');

const connect = async function(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/task_manager', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('connect db successfully!');
    } catch (error) {
        console.log('Connect db error!');
    }
}

module.exports = { connect }