const mongoose = require('mongoose');
const validator = require('validator');

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        default: '',
    },
    board:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'boards',
        required: true
    }
}, {
    timestamps: true
})

// boardSchema.pre('deleteMany', async function(next){
//     const board = this;
//     await Task.deleteMany({owner: board._id});
//     next();
// })

const Section = mongoose.model('sections',sectionSchema);

module.exports = Section;