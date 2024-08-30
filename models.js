const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

const studentSchema = new mongoose.Schema({
  name: String,
  mentors: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', default: null },
});

const Mentor = mongoose.model('Mentor', mentorSchema);
const Student = mongoose.model('Student', studentSchema);

module.exports = { Mentor, Student };
