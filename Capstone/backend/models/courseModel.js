const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }
});

module.exports = mongoose.model('Course', courseSchema);