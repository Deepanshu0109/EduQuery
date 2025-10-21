const Subject = require('../models/subject');

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 }); // alphabetically
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching subjects' });
  }
};
