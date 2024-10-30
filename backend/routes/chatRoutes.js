// const express = require('express');
// const router = express.Router();
// const {getConversations,getChats,sendChat} = require('../controllers/chatController');

// // Routes
// router.post('/chats',sendChat); // Send a chat message
// router.get('/chats/:conversationId',getChats); // Get chats in a conversation
// router.get('/conversations/:email',getConversations); // Get conversations by email

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const chatController = require('../controllers/chatController');

// //api/chat
// router.get('/conversations/:email', chatController.getConversations);
// router.get('/:conversationId', chatController.getChats);
// router.post('/chats', chatController.createChat);
// router.post('/chats/mark-read', chatController.markChatsAsRead);

// module.exports = router;

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to get a conversation between two users
router.get('/conversations/:user1Email/:user2Email', chatController.getConversation);

// Route to fetch all chat messages in a conversation
router.get('/:conversationId', chatController.getChats);

// Route to send a new message
router.post('/chats', chatController.sendMessage);

// Mark chat messages as read (if applicable)
router.post('/chats/mark-read', chatController.markAsRead);

module.exports = router;
