// controllers/profileController.js
const User = require('../models/User');

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error('getUserProfile error:', err);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    // Ensure the logged-in user can only update their own profile
    if (req.user._id.toString() !== req.params.id)
      return res.status(403).json({ message: 'Not allowed.' });

    const updates = {
      name: req.body.name || req.user.name,
      email: req.body.email || req.user.email,
      class: req.body.class || req.user.class,
      semester: req.body.semester || req.user.semester,
      rollNumber: req.body.rollNumber || req.user.rollNumber,
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error('updateUserProfile error:', err);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};
