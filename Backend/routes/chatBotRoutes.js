// Backend/routes/chatBotRoutes.js
import express from 'express';
// Import the specific controller function we need
import { handlePublicMessage } from '../controllers/chatbotController.js';

const router = express.Router();

// Route is public: POST /api/chat/message
router.post('/message', handlePublicMessage);

export default router;