const mongoose = require('mongoose')

const mailSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
})

const Mail = mongoose.model('Mail', mailSchema)

module.exports = Mail