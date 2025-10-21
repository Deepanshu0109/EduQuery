const express = require('express');
const router = express.Router();
const { getAllSubjects } = require('../controllers/subjectController');

router.get('/', getAllSubjects); // GET /api/subjects

module.exports = router;
