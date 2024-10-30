const express = require('express');
const router = express.Router();
const {submitFeedback,getAllFeedback,getFeedbackByEmail} = require('../controllers/feedbackController');

// Route to submit new feedback
router.post('/feedback', submitFeedback);

// Route to get all feedback (for admin)
router.get('/feedback', getAllFeedback);

// Route to get feedback by user email
router.get('/feedback/:email', getFeedbackByEmail);

module.exports = router;