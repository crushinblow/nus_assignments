const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('schoolId'); // link to school
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;