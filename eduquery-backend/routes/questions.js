// routes/questions.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const qc = require('../controllers/questionController');

// public: get all and get by id
router.get('/', qc.getAllQuestions);         // GET /api/questions

// protected routes (require auth)
router.get('/mine', auth, qc.getUserQuestions);
router.get('/:id', qc.getQuestionById);     // GET /api/questions/:id
router.post('/', auth, qc.createQuestion);              // POST /api/questions
router.post('/:id/answers', auth, qc.postAnswer);       // POST /api/questions/:id/answers
router.put('/:id', auth, qc.editQuestion);              // PUT /api/questions/:id
router.delete('/:id', auth, qc.deleteQuestion);         // DELETE /api/questions/:id
router.put('/:questionId/answers/:answerId/upvote', auth, qc.toggleUpvote);

router.put('/:id/answers/:answerId', auth, qc.editAnswer);     // PUT /api/questions/:id/answers/:answerId
router.delete('/:id/answers/:answerId', auth, qc.deleteAnswer); // DELETE /api/questions/:id/answers/:answerId

module.exports = router;
