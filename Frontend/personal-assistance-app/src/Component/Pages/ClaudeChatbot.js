import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../Styles/ClaudeChatbot.css';
import api from '../../Lib/api';

const ClaudeChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Load existing conversation if conversationId exists in localStorage
  useEffect(() => {
    const savedConversationId = localStorage.getItem('conversationId');
    if (savedConversationId) {
      setConversationId(savedConversationId);
      fetchConversation(savedConversationId);
    }
  }, []);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch conversation history
  const fetchConversation = async (id) => {
    try {
      const response = await api.get(`/api/chat/conversation/${id}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
      // If conversation not found, clear localStorage
      if (error.response?.status === 404) {
        localStorage.removeItem('conversationId');
        setConversationId(null);
      }
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (inputValue.trim()) {
      try {
        setIsLoading(true);
        
        // Optimistically add user message to UI
        const userMessage = {
          id: Date.now(),
          content: inputValue,
          role: 'user',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputValue('');
        
        // Send message to server
        const response = await api.post('/api/chat/chat', {
          message: inputValue,
          conversationId
        });
        
        // Save conversation ID
        if (response.data.conversationId !== conversationId) {
          setConversationId(response.data.conversationId);
          localStorage.setItem('conversationId', response.data.conversationId);
        }
        
        // Add bot response to messages
        setMessages(prevMessages => [...prevMessages, response.data.botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        // Add error message
        setMessages(prevMessages => [
          ...prevMessages, 
          {
            id: Date.now(),
            content: 'Sorry, I encountered an error. Please try again.',
            role: 'assistant',
            timestamp: new Date().toISOString()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const startNewConversation = () => {
    localStorage.removeItem('conversationId');
    setConversationId(null);
    setMessages([]);
  };
  
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI Assistant</h2>
        {conversationId && (
          <button className="new-chat-btn" onClick={startNewConversation}>
            New Chat
          </button>
        )}
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-messages">
            <p>How can I help you today?</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.role === 'assistant' ? 'bot-message' : 'user-message'}`}
            >
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message bot-message loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={!inputValue.trim() || isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ClaudeChatbot;