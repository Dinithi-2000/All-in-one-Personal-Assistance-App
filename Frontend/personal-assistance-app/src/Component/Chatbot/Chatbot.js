// Frontend/personal-assistance-app/src/Component/Chatbot/Chatbot.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios'; // For making API requests
import './Chatbot.css'; // We'll create this CSS file next

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi there! Ask me general questions about SeraniLux.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null); // Ref for focusing input

    // Function to scroll to the bottom of the messages
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    // Toggle chat window open/closed
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    // Update input field state
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading page
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return; // Don't send empty messages

        const userMessage = { sender: 'user', text: trimmedInput };
        // Add user message and clear input immediately for better UX
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true); // Show loading indicator

        try {
            // Send message to backend API endpoint
            // The 'proxy' in package.json handles prepending http://localhost:8070
            // The backend route is mounted at /api/chat, and the specific endpoint is /message
            const response = await axios.post('/api/chat/message', {
                message: trimmedInput
            });

            // Add bot's response to messages
            const botMessage = { sender: 'bot', text: response.data.reply };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Error sending message:", error);
            // Show a user-friendly error message in the chat
            const errorMessageText = error.response?.data?.error || 'Sorry, something went wrong. Please try again later.';
            const errorMessage = { sender: 'bot', text: errorMessageText, isError: true };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false); // Hide loading indicator
            // Ensure input is focused again after response
            inputRef.current?.focus();
        }
    };

    return (
        <div className="chatbot-container">
            {/* Chat Window - shown only if isOpen is true */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>SeraniLux Assistant</span>
                        <button onClick={toggleChat} className="close-chat-btn" aria-label="Close Chat">✕</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}
                            >
                                {/* Basic rendering of text, handles newlines from AI */}
                                {typeof msg.text === 'string' ? msg.text.split('\n').map((line, i) => (
                                    <span key={i}>{line}<br/></span>
                                )) : 'Invalid message format'}
                            </div>
                        ))}
                        {/* Loading indicator */}
                        {isLoading && <div className="message bot typing"><span>.</span><span>.</span><span>.</span></div>}
                        {/* Invisible element to scroll to */}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="chat-input-form">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Ask a question..."
                            disabled={isLoading} // Disable input while loading
                            aria-label="Chat input"
                        />
                        <button type="submit" disabled={isLoading || !inputValue.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button - always visible */}
            <button onClick={toggleChat} className="chat-toggle-button" aria-label={isOpen ? 'Close Chat' : 'Open Chat'}>
                {isOpen ? (
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}
            </button>
        </div>
    );
};

export default Chatbot;