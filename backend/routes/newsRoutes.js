// routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const { getTopHeadlines } = require('../controllers/newsController');

// Route to get top headlines from News API
router.get('/top-headlines', getTopHeadlines);

module.exports = router;
