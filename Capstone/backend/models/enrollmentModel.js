const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);