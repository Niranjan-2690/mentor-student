const express = require("express");
const mentorRouter = express.Router();
const Mentor = require('./mentor.model'); // Ensure the correct model name
const Student = require('../student/student.model'); // Assuming you have a Student model

// Create mentor
mentorRouter.post("/creatementor", async (req, res) => {
  const createMentor = new Mentor(req.body); // Use the correct model name

  try {
    const createdMentor = await createMentor.save();
    return res.status(201).json({
      message: "Mentor created successfully",
      data: createdMentor // Send the actual saved mentor data back
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error creating mentor",
      error: error.message // Return only the error message
    });
  }
});

// API to Assign multiple Students to a Mentor
mentorRouter.post('/mentor/:mentorId/assign-students', async (req, res) => {
  const { mentorId } = req.params;
  const { studentIds } = req.body;

  try {
    const mentor = await Mentor.findById(mentorId); // Use the correct model name
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    // Find students that don't already have a mentor
    const students = await Student.find({ _id: { $in: studentIds }, mentor: null });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: 'Some students already have a mentor' });
    }

    // Assign mentor to students and update mentor's student list
    await Student.updateMany({ _id: { $in: studentIds } }, { mentor: mentorId });
    mentor.students.push(...studentIds);
    await mentor.save();

    res.status(200).json({ message: "Students assigned successfully", mentor });
  } catch (error) {
    res.status(400).json({ message: "Error assigning students", error: error.message });
  }
});

// API to Show All Students for a Particular Mentor
mentorRouter.get('/mentor/:mentorId/students', async (req, res) => {
  const { mentorId } = req.params;

  try {
    const mentor = await Mentor.findById(mentorId).populate('students'); // Use the correct model name
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    res.status(200).json({ students: mentor.students });
  } catch (error) {
    res.status(400).json({ message: "Error retrieving students", error: error.message });
  }
});

module.exports = mentorRouter;
