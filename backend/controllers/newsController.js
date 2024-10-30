// controllers/newsController.js
const axios = require('axios');

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';
const NEWS_API_KEY = '541c33d1869a4b878c98a4674140b9f3'; // Replace with your actual News API key

// Controller to fetch top headlines
const getTopHeadlines = async (req, res) => {
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        country: req.query.country || 'us', // default to 'us' but can pass other countries
        category: req.query.category || 'general',
        apiKey: NEWS_API_KEY
      }
    });

    res.status(200).json(response.data.articles); // Send only articles to frontend
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news' });
  }
};

module.exports = {
  getTopHeadlines,
};
