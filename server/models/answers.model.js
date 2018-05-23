const mongoose = require('mongoose')

const answerSchema = mongoose.Schema({
    detail: {
        type: String,
        required: [true, 'detail must be inputed']
    },
    vote: {
        type: Number
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    voters: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {
    timestamps: true
})

const Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer