const express = require('express');
const mongoose = require('mongoose');
const { Mentor, Student } = require('./models');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mentor-student');

// API to create a Mentor
app.post('/mentor', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).send(mentor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API to create a Student
app.post('/student', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API to Assign multiple Students to a Mentor
app.post('/mentor/:mentorId/assign-students', async (req, res) => {
  const { mentorId } = req.params;
  const { studentIds } = req.body;

  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).send('Mentor not found');

    const students = await Student.find({ _id: { $in: studentIds }, mentor: null });
    if (students.length !== studentIds.length) {
      return res.status(400).send('Some students already have a mentor');
    }

    await Student.updateMany({ _id: { $in: studentIds } }, { mentor: mentorId });
    mentor.students.push(...studentIds);
    await mentor.save();

    res.send(mentor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API to Assign or Change Mentor for a particular Student
app.put('/student/:studentId/assign-mentor', async (req, res) => {
  const { studentId } = req.params;
  const { mentorId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).send('Student not found');

    const newMentor = await Mentor.findById(mentorId);
    if (!newMentor) return res.status(404).send('Mentor not found');

    if (student.mentor) {
      const oldMentor = await Mentor.findById(student.mentor);
      oldMentor.students.pull(studentId);
      await oldMentor.save();
    }

    student.mentor = mentorId;
    await student.save();

    newMentor.students.push(studentId);
    await newMentor.save();

    res.send(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API to Show All Students for a Particular Mentor
app.get('/mentor/:mentorId/students', async (req, res) => {
  const { mentorId } = req.params;

  try {
    const mentor = await Mentor.findById(mentorId).populate('students');
    if (!mentor) return res.status(404).send('Mentor not found');

    res.send(mentor.students);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API to Show Previously Assigned Mentor for a Particular Student
app.get('/student/:studentId/mentor', async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId).populate('mentor');
    if (!student) return res.status(404).send('Student not found');

    res.send(student.mentor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Start the Server
const port = 3000;
app.listen(port, "0.0.0.0", (err)=>{
  if(err){
    console.log("Error", err)
  }else{
    console.log("Server is connected")
  }
})