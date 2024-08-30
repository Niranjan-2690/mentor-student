const express = require("express");
const studentRouter = express.Router();
const Mentor = require('../mentor/mentor.model')
const Student = require('./student.model'); // Assuming you have a Student model


//API to create a Student
studentRouter.post('/student', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API to Show All Students for a Particular Mentor
studentRouter.get('/mentor/:mentorId/students', async (req, res) => {
  const { mentorId } = req.params;

  try {
    const mentor = await Mentor.findById(mentorId).populate('students'); // Use the correct model name
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    res.status(200).json({ students: mentor.students });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving students", error: error.message });
  }
});

//API to Assign or Change Mentor for a particular Student
studentRouter.put('/student/:studentId/assign-mentor', async (req, res) => {
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


// API to Show Previously Assigned Mentor for a Particular Student
studentRouter.get('/student/:studentId/mentor', async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId).populate('mentor');
    if (!student) return res.status(404).send('Student not found');

    res.send(student.mentor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = studentRouter;
