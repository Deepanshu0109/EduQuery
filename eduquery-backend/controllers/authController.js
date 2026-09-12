const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, class: studentClass, semester, rollNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special symbol.' 
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return res.status(409).json({ message: 'User already exists with that email.' });
      }
      user.name = name;
      user.password = password; 
    } else {
      user = new User({ name, email, password, class: studentClass || '', semester: semester || 1, rollNumber: rollNumber || '' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'EduQuery - Verify Your Email',
        text: `Hello ${user.name},\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
      });
      res.status(200).json({ message: 'OTP sent to email. Please verify.' });
    } catch (mailError) {
      console.error('Mail sending failed:', mailError);
      if (!user.isVerified) {
        await User.deleteOne({ email: user.email });
      }
      return res.status(400).json({ message: 'Failed to send email. Please ensure the email address is valid.' });
    }

  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified.' });
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user);
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during verification.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: 'This email is not registered.' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email before logging in.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password.' });

    const token = generateToken(user);
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'If this email is registered, a reset link will be sent.' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'EduQuery - Password Reset Request',
      text: `Hello ${user.name},\n\nYou requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
    });

    res.status(200).json({ message: 'Password reset link sent to email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error sending reset link.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special symbol.' 
      });
    }

    user.password = newPassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password.' });
  }
};