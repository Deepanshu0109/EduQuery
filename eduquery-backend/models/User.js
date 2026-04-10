// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, minlength: 6 },
  isVerified: { type: Boolean, default: false }, 
  otp: { type: String },                         
  otpExpires: { type: Date },                    
  class: { type: String, default: '' },
  semester: { type: Number, min: 1, max: 8, default: 1 },
  rollNumber: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// NEW: MongoDB TTL Index
// This automatically deletes the document 15 minutes (900 seconds) after 'createdAt'
// BUT ONLY IF 'isVerified' is false. If they verify, MongoDB ignores this rule.
userSchema.index(
  { createdAt: 1 }, 
  { 
    expireAfterSeconds: 900, 
    partialFilterExpression: { isVerified: false } 
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next(); 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return false; 
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);