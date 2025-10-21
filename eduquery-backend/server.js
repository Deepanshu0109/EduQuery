// server.js
require('dotenv').config(); // loads .env into process.env
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');

// route files
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/users');
const subjectRoutes = require('./routes/subjects');
const app = express();




// connect to DB
connectDB();

// global middleware
app.use(cors()); // enable Cross-Origin Resource Sharing
app.use(express.json()); // parse JSON request bodies into req.body
app.use(morgan('dev')); // log incoming requests in dev format

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
// basic health route
app.get('/', (req, res) => {
  res.send('EduQuery API is running');
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
