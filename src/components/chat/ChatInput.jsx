import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="flex-1 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={3}
        disabled={isLoading}
      />
      <button 
        type="submit" 
        disabled={!message.trim() || isLoading}
        className="self-end px-6 py-3 bg-gradient-to-r from-[#CEB4FF] to-[#77E5D4] text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default ChatInput; 