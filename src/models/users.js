const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: { terms_accepted: true }
        },
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if( value < 0 ){
                throw new Error('Age must be a postive number!')
            }
        }
    }
});

User.pre('save', async function(next) { 
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

module.exports = mongoose.model('users',User);