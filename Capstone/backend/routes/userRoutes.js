const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();   // fetch all documents in "users" collection
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;