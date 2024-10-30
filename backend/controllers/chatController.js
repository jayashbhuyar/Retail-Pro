// // controllers/chatController.js
// const Chat = require('../models/Chat');
// const Conversation = require('../models/Conversation');

// exports.getConversations = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const conversations = await Conversation.find({
//       participants: email
//     }).populate('lastChat');
//     res.json(conversations);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getChats = async (req, res) => {
//   try {
//     const { conversationId } = req.params;
//     const chats = await Chat.find({ conversationId })
//       .sort('createdAt');
//     res.json(chats);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.createChat = async (req, res) => {
//   try {
//     const { senderEmail, receiverEmail, content, conversationId } = req.body;
    
//     // Create or get conversation
//     let conversation;
//     if (conversationId) {
//       conversation = await Conversation.findById(conversationId);
//     } else {
//       conversation = await Conversation.create({
//         participants: [senderEmail, receiverEmail]
//       });
//     }

//     // Create chat
//     const chat = await Chat.create({
//       senderEmail,
//       receiverEmail,
//       content,
//       conversationId: conversation._id,
//       status: 'sent'
//     });

//     // Update conversation's lastChat
//     conversation.lastChat = chat._id;
//     conversation.updatedAt = Date.now();
//     await conversation.save();

//     res.json(chat);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.markChatsAsRead = async (req, res) => {
//   try {
//     const { conversationId, receiverEmail } = req.body;
    
//     await Chat.updateMany(
//       {
//         conversationId,
//         receiverEmail,
//         status: { $ne: 'read' }
//       },
//       {
//         $set: { status: 'read' }
//       }
//     );

//     res.json({ message: 'Messages marked as read' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const Conversation = require('../models/Conversation'); // Assuming Conversation model exists
const Chat = require('../models/Chat'); // Assuming Chat model exists

// Get or create a conversation between two users
exports.getConversation = async (req, res) => {
  const { user1Email, user2Email } = req.params;
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [user1Email, user2Email] },
    });
    
    if (!conversation) {
      // If no conversation exists, create one
      conversation = await Conversation.create({ participants: [user1Email, user2Email] });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Server error fetching conversation' });
  }
};

// Fetch all chat messages in a conversation
exports.getChats = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const chats = await Chat.find({ conversationId }).sort({ createdAt: 1 }); // Sort by time ascending
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Server error fetching chats' });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  const { senderEmail, receiverEmail, content, conversationId } = req.body;
  try {
    const newChat = await Chat.create({
      conversationId,
      senderEmail,
      receiverEmail,
      content,
      status: 'sent',
      createdAt: new Date(),
    });
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
};

// Mark chat messages as read
exports.markAsRead = async (req, res) => {
  const { conversationId, receiverEmail } = req.body;
  try {
    await Chat.updateMany(
      { conversationId, receiverEmail, status: { $ne: 'read' } },
      { status: 'read' }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Server error marking messages as read' });
  }
};
