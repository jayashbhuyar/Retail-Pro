const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    }
  },
  complaint: {
    type: String,
    trim: true
  },
  review: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a text index for full-text search on complaint and review fields
feedbackSchema.index({ complaint: 'text', review: 'text' });

// Create a compound index on user email and createdAt for efficient querying
feedbackSchema.index({ 'user.email': 1, createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;