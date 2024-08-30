const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    name: {
        type : String,
        required: true
    }
}, {timestamps : true})


module.exports = studentSchema;