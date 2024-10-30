const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },   // Email of the sender
  receiverEmail: { type: String, required: true }, // Email of the receiver
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true }, // Reference to the conversation
  content: { type: String, required: true }, // The chat content
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }, // Chat status
  createdAt: { type: Date, default: Date.now }, // Timestamp when chat was created
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
