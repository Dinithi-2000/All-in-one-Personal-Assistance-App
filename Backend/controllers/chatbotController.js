// Backend/controllers/chatbotController.js
import { getPublicChatbotResponse } from '../services/chatbotService.js';

export const handlePublicMessage = async (req, res) => {
    console.log("[Controller Log] handlePublicMessage function entered.");
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || message.trim() === '') {
            console.log("Chatbot controller: Invalid message received.");
            return res.status(400).json({ error: 'Valid, non-empty message is required' });
        }

        console.log(`Chatbot controller: Received message - "${message}"`);
        const responseText = await getPublicChatbotResponse(message);
        console.log(`Chatbot controller: Sending reply - "${responseText}"`);

        res.status(200).json({ reply: responseText });

    } catch (error) {
        // Log the actual error on the server for debugging
        console.error('Chatbot Controller Error:', error);
        // Send a generic error to the client
        res.status(500).json({ error: 'Sorry, failed to process chatbot message due to a server error.' });
    }
};