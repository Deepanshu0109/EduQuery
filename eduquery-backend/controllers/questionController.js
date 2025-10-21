// controllers/questionController.js
const Question = require('../models/Question');
const Subject = require('../models/subject');
// Create a question
exports.createQuestion = async (req, res) => {
  try {
    const { title, body, subjectId, tags } = req.body;
    if (!title || !body || !subjectId) {
      return res.status(400).json({ message: 'Title, body, and subject are required.' });
    }

    // check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(400).json({ message: 'Invalid subject.' });

    const question = new Question({
      title,
      body,
      subject: subject._id,
      tags: tags || [],
      author: req.user._id,
    });

    await question.save();
    const populated = await question.populate([
      { path: 'author', select: 'name email' },
      { path: 'subject' }
    ]);

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating question.' });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const { subjectId } = req.query;
    const filter = subjectId ? { subject: subjectId } : {};

    const questions = await Question.find(filter)
      .populate('author', 'name email')
      .populate('subject')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching questions.' });
  }
};


// GET /api/questions/mine
// GET /api/questions/mine
exports.getUserQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ author: req.user._id })
      .populate([
        { path: 'author', select: 'name email' },
        { path: 'subject', select: 'name' },
        { path: 'answers.author', select: 'name email' }, // ✅ populate answer authors
      ])
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error('getUserQuestions error:', err);
    res.status(500).json({ message: 'Server error fetching user questions.' });
  }
};




// Get single question
exports.getQuestionById = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id).populate('author', 'name email').populate('answers.author', 'name email').populate('subject', 'name');
    if (!q) return res.status(404).json({ message: 'Question not found.' });
    res.json(q);
  } catch (err) {
    console.error('getQuestionById error:', err);
    res.status(500).json({ message: 'Server error fetching question.' });
  }
};

// Post an answer (push to answers array)
exports.postAnswer = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ message: 'Answer body is required.' });

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found.' });

    const answer = {
      body,
      author: req.user._id,
      createdAt: Date.now(),
    };

    question.answers.push(answer);
    await question.save();

    // Return the question with populated authors
    const updated = await Question.findById(req.params.id)
      .populate('answers.author', 'name email')
      .populate('author', 'name email');

    res.status(201).json(updated);
  } catch (err) {
    console.error('postAnswer error:', err);
    res.status(500).json({ message: 'Server error posting answer.' });
  }
};


// Edit question (only author)
exports.editQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found.' });

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden. Not the author.' });
    }

    if (title) question.title = title;
    if (body) question.body = body;
    if (tags) question.tags = tags;
    question.updatedAt = Date.now();

    await question.save();
    res.json(question);
  } catch (err) {
    console.error('editQuestion error:', err);
    res.status(500).json({ message: 'Server error editing question.' });
  }
};

// Delete question (only author)
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found.' });

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden. Not the author.' });
    }

    // ✅ Modern way to delete
    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Question deleted.' });
  } catch (err) {
    console.error('deleteQuestion error:', err);
    res.status(500).json({ message: 'Server error deleting question.' });
  }
};


// Edit an answer (only answer author)
exports.editAnswer = async (req, res) => {
  try {
    const { body } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found.' });

    const answer = question.answers.id(req.params.answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found.' });

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden. Not the answer author.' });
    }

    answer.body = body || answer.body;
    answer.updatedAt = Date.now();

    await question.save();

    // Return updated question with populated authors
    const updated = await Question.findById(req.params.id)
      .populate('answers.author', 'name email')
      .populate('author', 'name email');

    res.json(updated);
  } catch (err) {
    console.error('editAnswer error:', err);
    res.status(500).json({ message: 'Server error editing answer.' });
  }
};


// Delete an answer (only answer author)
exports.deleteAnswer = async (req, res) => {
  try {
    const { id: questionId, answerId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found.' });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found.' });

    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden. Not the answer author.' });
    }

    // Remove the answer
    question.answers = question.answers.filter(a => a._id.toString() !== answerId);
    await question.save();

    // Return updated question with populated authors
    const updated = await Question.findById(questionId)
      .populate('answers.author', 'name email')
      .populate('author', 'name email');

    res.json(updated);
  } catch (err) {
    console.error('deleteAnswer error:', err);
    res.status(500).json({ message: 'Server error deleting answer.' });
  }
};


// PUT /api/questions/:questionId/answers/:answerId/upvote
// Toggle upvote for an answer
// PUT /api/questions/:questionId/answers/:answerId/upvote
exports.toggleUpvote = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found.' });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found.' });

    const userId = req.user._id.toString();
    const index = answer.upvotes.findIndex(id => id.toString() === userId);

    if (index === -1) {
      answer.upvotes.push(userId); // like
    } else {
      answer.upvotes.splice(index, 1); // unlike
    }

    await question.save();

    // Return updated question with populated authors for frontend
    const updated = await Question.findById(questionId)
      .populate('answers.author', 'name email')
      .populate('author', 'name email')
      .populate('subject', 'name');

    res.json(updated);
  } catch (err) {
    console.error('toggleUpvote error:', err);
    res.status(500).json({ message: 'Server error toggling upvote.' });
  }
};



