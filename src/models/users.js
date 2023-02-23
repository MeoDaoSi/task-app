const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    age: {
        type: Number,
        default: 0,
        validate(value){
            if( value < 0 ){
                throw new Error('Age must be a postive number!')
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
    ]
});

userSchema.virtual('tasks',{
    ref: 'tasks',
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

userSchema.pre('save', async function(next) { 
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('users',userSchema);

module.exports = User;

// index: {
//     unique: true,
//     partialFilterExpression: { terms_accepted: true }
// },