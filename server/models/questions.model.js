const mongoose = require('mongoose')

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title must be inputed']
    },
    detail: {
        type: String,
        required: [true, 'detail must be inputed']
    },
    vote: {
        type: Number
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    voters: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}]   
}, {
    timestamps: true
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question