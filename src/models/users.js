const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./tasks');
const Board = require('./boards');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

userSchema.virtual('allBoard',{
    ref: 'boards',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = function(){
    user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'meodaosi' )
    user.tokens = user.tokens.concat({token});
    user.save();
    return token;
}

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

userSchema.statics.findByCredentials = async function( email, password ) {
    const user = await this.findOne({email});
    if(!user){
        throw new Error('Invalid credentials!');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Invalid credentials!');
    }
    return user;
}

// hash explain text password before saving
userSchema.pre('save', async function(next) { 
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// delete all tasks before removing user
userSchema.pre('remove', async function(next){
    const user = this;
    await Board.deleteMany({owner: user._id});
    next();
});

const User = mongoose.model('users',userSchema);

module.exports = User;

// index: {
//     unique: true,
//     partialFilterExpression: { terms_accepted: true }
// },