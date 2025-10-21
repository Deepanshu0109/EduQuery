// models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // subject name
});

module.exports = mongoose.model('Subject', subjectSchema);
