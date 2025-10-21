const mongoose = require('mongoose');
const Subject = require('../models/subject'); // adjust path if needed
const subjects = require('../subjects.json'); // array of subject names
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

(async () => {
  try {
    for (let name of subjects) {
      await Subject.findOneAndUpdate({ name }, { name }, { upsert: true });
    }
  console.log('All subjects imported successfully!');
  // close the mongoose connection cleanly
  await mongoose.connection.close();
  } catch (err) {
    console.error('Error importing subjects:', err);
  }
})();
