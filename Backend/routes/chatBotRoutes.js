import bcrypt from 'bcryptjs';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';


const router = express.Router();

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'assistant'] },
    timestamp: { type: Date, default: Date.now }
});
  
const conversationSchema = new mongoose.Schema({
    conversationId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    messages: [messageSchema]
});
  
  // Create Conversation model
const Conversation = mongoose.model('conversations', conversationSchema);
  
// Claude API route
router.post('/chat', async (req, res) => {
try {
    const { message, conversationId } = req.body;
    let conversation;
    let userMessage;
    
    // Create a new conversation if it doesn't exist
    if (!conversationId) {
    // Generate new conversation ID
    const newConversationId = Date.now().toString();
    
    // Create user message
    userMessage = {
        content: message,
        role: 'user',
        timestamp: new Date()
    };
    
    // Create new conversation with the message
    conversation = new Conversation({
        conversationId: newConversationId,
        messages: [userMessage]
    });
    
    // Save to MongoDB
    await conversation.save();
    
    // Call Claude API
    const claudeResponse = await callClaudeAPI(
        conversation.conversationId, 
        conversation.messages
    );
    
    // Add bot message to conversation
    conversation.messages.push(claudeResponse);
    conversation.updatedAt = new Date();
    await conversation.save();
    
    // Return the response to the client
    return res.json({
        conversationId: conversation.conversationId,
        userMessage,
        botMessage: claudeResponse
    });
    } else {
    // Find existing conversation
    conversation = await Conversation.findOne({ conversationId });
    
    if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Create user message
    userMessage = {
        content: message,
        role: 'user',
        timestamp: new Date()
    };
    
    // Add message to existing conversation
    conversation.messages.push(userMessage);
    
    // Call Claude API
    const claudeResponse = await callClaudeAPI(
        conversation.conversationId, 
        conversation.messages
    );
    
    // Add bot message to conversation
    conversation.messages.push(claudeResponse);
    conversation.updatedAt = new Date();
    await conversation.save();
    
    // Return the response to the client
    return res.json({
        conversationId: conversation.conversationId,
        userMessage,
        botMessage: claudeResponse
    });
    }
} catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
    error: 'An error occurred while processing your request',
    details: error.message
    });
}
});

async function callLocalLLM(messages) {
    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: "llama2", // or "mistral" or other models you've pulled
        prompt: formatMessagesForOllama(messages),
        stream: false
      });
      
      return {
        content: response.data.response,
        role: 'assistant',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error calling local LLM:', error);
      throw new Error('Failed to get response from LLM');
    }
  }
  
// Function to call Claude API
async function callClaudeAPI(conversationId, messages) {
try {
    // Format messages for Claude API (exclude mongoose metadata)
    const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
    }));
    
    // Create request for Claude API
    const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
        model: 'claude-3-sonnet-20240229', // Or your preferred Claude model
        messages: formattedMessages,
        max_tokens: 1000
    },
    {
        headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
        }
    }
    );
    
    // Create bot message
    const botMessage = {
    content: response.data.content[0].text,
    role: 'assistant',
    timestamp: new Date()
    };
    
    return botMessage;
} catch (error) {
    console.error('Error calling Claude API:', error.response?.data || error.message);
    throw new Error('Failed to get response from Claude');
}
}
  
  // Get conversation history
router.get('/conversation/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const conversation = await Conversation.findOne({ conversationId: id });
        
        if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
        }
        
        res.json({ messages: conversation.messages });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ 
        error: 'An error occurred while fetching the conversation',
        details: error.message
        });
    }
});
  
  // Get all conversations (useful for showing conversation history)
router.get('/conversations', async (req, res) => {
    try {
        // Get only basic info for all conversations, sorted by most recent
        const conversations = await Conversation.find({}, {
        conversationId: 1,
        createdAt: 1,
        updatedAt: 1,
        'messages.0.content': 1 // Just get first message as preview
        }).sort({ updatedAt: -1 });
        
        res.json({ conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ 
        error: 'An error occurred while fetching conversations',
        details: error.message
        });
    }
});
  
// Delete a conversation
router.delete('/conversation/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Conversation.deleteOne({ conversationId: id });
        
        if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Conversation not found' });
        }
        
        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ 
        error: 'An error occurred while deleting the conversation',
        details: error.message
        });
    }
});

export default router;