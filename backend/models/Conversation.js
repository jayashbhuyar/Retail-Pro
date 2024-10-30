const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }], // List of emails of the participants in the conversation
  lastChat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, // Reference to the last chat message
  updatedAt: { type: Date, default: Date.now }, // Timestamp when the conversation was last updated
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
