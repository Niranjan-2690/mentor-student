const mongoose = require('mongoose')
const mentorSchema = require("./mentor.schema")


const mentorModule = mongoose.model("mentor", mentorSchema)

module.exports = mentorModule;