const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollmentModel');

// GET all enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('courseId'); // link to course
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new enrollment
router.post('/', async (req, res) => {
  try {
    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;