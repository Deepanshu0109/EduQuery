// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // read MONGO_URI from env
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // exit the process on failure
  }
};

module.exports = connectDB;
