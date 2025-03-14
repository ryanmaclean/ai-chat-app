import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { estimateTokens } from '../../lib/models/api';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setMessage(text);
    setTokenCount(estimateTokens(text));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      setTokenCount(0);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative glass-morphism rounded-lg">
        <textarea
          className="w-full bg-transparent border-none outline-none resize-none p-4 pr-12 text-white placeholder-gray-400 min-h-[80px] max-h-[300px]"
          placeholder="Type your message here..."
          value={message}
          onChange={handleInputChange}
          disabled={isLoading}
          rows={3}
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <span className="text-xs text-gray-400">~{tokenCount} tokens</span>
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !message.trim()} 
            className="rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput; 