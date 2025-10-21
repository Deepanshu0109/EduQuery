// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, class: studentClass, semester, rollNumber } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide name, email and password.' });
    }

    // check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: 'User already exists with that email.' });
    }

    // create new user
    const user = new User({
      name,
      email,
      password,
      class: studentClass || '',
      semester: semester || 1,
      rollNumber: rollNumber || '',
    });

    await user.save();

    const token = generateToken(user._id);

    // return user info + token (omit password)
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: user.class,
        semester: user.semester,
        rollNumber: user.rollNumber,
      },
      token,
    });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'Please provide email and password.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials.' });

    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: user.class,
        semester: user.semester,
        rollNumber: user.rollNumber,
      },
      token,
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
