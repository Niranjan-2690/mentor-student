const mongoose = require('mongoose')

const mentorSchema = mongoose.Schema({
    name: {
        type : String,
        required: true
    }
}, {timestamps : true})


module.exports = mentorSchema;