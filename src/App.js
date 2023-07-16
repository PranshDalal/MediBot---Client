import React, { useState, useEffect } from 'react';
import './index.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/chat/history');
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const userMessage = inputValue.trim();
    if (userMessage !== '') {
      const updatedMessages = [
        ...messages,
        { sender: 'user', message: userMessage },
        { sender: 'bot', message: 'Typing...' },
      ];
      setMessages(updatedMessages);

      const response = await sendChatMessage(userMessage);

      updatedMessages[updatedMessages.length - 1] = { sender: 'bot', message: response };
      setMessages(updatedMessages);
    }

    setInputValue('');
  };

  const sendChatMessage = async (message) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      return 'An error occurred while processing your message.';
    }
  };

  return (
    <div className="chatbot">
      {/* Title */}
      <h1>MedBot - Personal Healthcare Assistant</h1>
      {/* Created by */}
      <p style={{ textAlign: 'center' }}>Created by Pransh Dalal</p>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;
