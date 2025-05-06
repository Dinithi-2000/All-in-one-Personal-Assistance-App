// Backend/services/chatbotService.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// --- Gemini API Setup ---
const API_KEY = process.env.GOOGLE_API_KEY;
let genAI;
let model;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    // Use a model suitable for free tier / general chat.
    // gemini-1.5-flash-latest is often good for speed/cost/free tier.
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    console.log("Google Generative AI SDK initialized with model: gemini-1.5-flash-latest");
} else {
    console.warn("WARN: GOOGLE_API_KEY not found in .env. Chatbot will only use predefined rules.");
}

// --- Simple Rule-Based Responses (Free Fallback) ---
const faqRules = {
    'what is seranilux?': 'SeraniLux is a demo platform connecting users with local service providers.',
    'how do i contact support?': 'For a real platform, you\'d typically find a "Contact Us" or "Support" link.',
    'how do i book?': 'You usually browse services, pick a provider/time, and confirm on the website.',
    'how to pay?': 'Payment is often handled securely online via credit card or similar methods after booking.',
    'hello': 'Hi there! Ask me a general question about SeraniLux.',
    'hi': 'Hello! How can I help with general information?',
    'thanks': 'You\'re welcome!',
    'thank you': 'Happy to help! Any other general questions?',
};

// --- Main Service Function ---
export const getPublicChatbotResponse = async (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase().trim();

    // 1. Check Simple Rules First (Free)
    if (faqRules[lowerCaseMessage]) {
        console.log(`Chatbot Service: Using FAQ rule for "${lowerCaseMessage}"`);
        return faqRules[lowerCaseMessage];
    }

    // 2. If rules don't match AND API key is configured, try Gemini (Potentially Free Tier)
    if (model) {
        console.log(`Chatbot Service: Sending message to Gemini: "${userMessage}"`);
        try {
            // --- Safety Settings (Optional but Recommended) ---
            // Adjust these based on the type of responses you want to allow/block
            const safetySettings = [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ];

            // --- Generation Configuration (Optional) ---
            const generationConfig = {
                // temperature: 0.9, // Controls randomness (0=deterministic, 1=creative)
                // topK: 1,
                // topP: 1,
                maxOutputTokens: 256, // Limit response length
            };

            // --- Define the Chat Prompt Structure ---
            // Provide context/persona for the AI
            const systemInstruction = "You are a friendly assistant for SeraniLux, a demo service booking website. Your goal is to answer general questions about how the platform works (like booking, payments, finding services). You CANNOT access user data, perform actions (like booking or paying), or see real-time information. If asked to do something you can't, politely explain your limitation as a demo assistant and suggest where the user might find the feature on the actual website (e.g., 'To book, please visit the Service Selection page', 'Check your 'My Bookings' page for booking details'). Keep answers helpful and relatively concise.";

            // Construct parts for the Gemini API
            const chatParts = [
                { text: systemInstruction }, // System context
                { text: `\n\nUser Query: ${userMessage}` }, // User's actual message
                { text: "\nAssistant Response:" } // Prompt AI to start generating here
            ];

            // --- Call the Gemini API ---
            const result = await model.generateContent({
                contents: [{ role: "user", parts: chatParts }], // Structure content correctly
                generationConfig,
                safetySettings,
            });

            // --- Process the Response ---
            let text = '';
            // Check if the response or candidates exist before accessing text
            if (result && result.response && typeof result.response.text === 'function') {
                text = result.response.text();
                console.log(`Chatbot Service: Received reply from Gemini.`);
            } else {
                // Handle cases where the response might be blocked or empty
                console.warn("Chatbot Service: Gemini response was empty or blocked.", result?.response?.promptFeedback);
                text = "I received your message, but I couldn't generate a suitable response. This might be due to safety filters or temporary issues.";
                // You might want to inspect result.response.promptFeedback for block reasons
                if (result?.response?.promptFeedback?.blockReason) {
                    text += ` (Reason: ${result.response.promptFeedback.blockReason})`;
                }
            }

            return text.trim(); // Return the generated text

        } catch (error) {
            console.error("Chatbot Service: Error calling Google Generative AI API:", error);
            // Provide specific feedback for common issues if possible
            if (error.message.includes('API key not valid')) {
                 return "AI configuration error: The API key is invalid. Please check the backend setup.";
            } else if (error.message.includes('quota')) { // Check for quota errors (exact message might vary)
                return "The AI service is currently experiencing high demand (quota possibly exceeded). Please try again later.";
            }
            // Generic fallback for other errors
            return "Sorry, I encountered a technical issue while contacting the AI service. Please try again.";
        }
    } else {
        // 3. Fallback if no rule matched and no API key configured (Free)
        console.log(`Chatbot Service: No FAQ rule matched for "${lowerCaseMessage}" and AI not configured. Using fallback.`);
        return "I can only answer some basic predefined questions right now. Is there anything else I can help you with from my limited knowledge?";
    }
};