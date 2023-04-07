const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');
const Board = require('./boards');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        // validate(value){
        //     if (!validator.isEmail(value)) {
        //         throw new Error('Email is invalid!')
        //     }
        // }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        // minlength: 7,
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
    // avatar: {
    //     type: Buffer
    // }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

adminSchema.methods.toJSON = function(){
    const admin = this;

    const adminObject = admin.toObject();

    delete adminObject.tokens;
    delete adminObject.password;

    return adminObject;
}

adminSchema.methods.generateAuthToken = function() {
    admin = this;
    const token = jwt.sign({_id: admin._id.toString() }, 'meodaosi')
    admin.tokens = admin.tokens.concat({token})
    admin.save();
    return token;
}


// adminSchema.virtual('allBoard',{
//     ref: 'boards',
//     localField: '_id',
//     foreignField: 'owner'
// })

// adminSchema.methods.generateAuthToken = function(){
//     user = this;
//     const token = jwt.sign({ _id: user._id.toString() }, 'meodaosi' )
//     user.tokens = user.tokens.concat({token});
//     user.save();
//     return token;
// }

// adminSchema.methods.toJSON = function(){
//     const user = this;
//     const userObject = user.toObject();
    
//     delete userObject.password;
//     delete userObject.tokens;

//     return userObject;
// };

// adminSchema.statics.findByCredentials = async function( email, password ) {
//     const user = await this.findOne({email});
//     if(!user){
//         throw new Error('Invalid credentials!');
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if(!isMatch){
//         throw new Error('Invalid credentials!');
//     }
//     return user;
// }

// // hash explain text password before saving
// adminSchema.pre('save', async function(next) { 
//     const user = this;
//     if(user.isModified('password')){
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// });

// // delete all tasks before removing user
// adminSchema.pre('remove', async function(next){
//     const user = this;
//     await Board.deleteMany({owner: user._id});
//     next();
// });

const Admin = mongoose.model('admins',adminSchema);

module.exports = Admin;

// index: {
//     unique: true,
//     partialFilterExpression: { terms_accepted: true }
// },