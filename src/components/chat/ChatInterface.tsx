import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import { Message, ModelParams } from '../../types/models';
import { generateCompletion } from '../../lib/models/api';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState('gpt-4o');
  const [modelParams, setModelParams] = useState<ModelParams>({
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are a helpful AI assistant.'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Add system message to context if it's the first message
      const contextMessages = messages.length === 0 
        ? [{ 
            id: 'system', 
            role: 'system', 
            content: modelParams.systemPrompt, 
            createdAt: new Date().toISOString() 
          }, userMessage] 
        : [...messages, userMessage];
      
      // Generate AI response
      const response = await generateCompletion(
        selectedModelId,
        contextMessages,
        modelParams
      );
      
      // Add AI response to chat
      setMessages(prev => [...prev, response.message]);
    } catch (error) {
      console.error('Error generating completion:', error);
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, there was an error generating a response. Please try again.',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
  };
  
  const handleModelParamsChange = (params: Partial<ModelParams>) => {
    setModelParams(prev => ({ ...prev, ...params }));
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="glass-morphism rounded-lg p-4 h-[calc(100vh-250px)] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-center">
                  Start a conversation with the AI.<br />
                  Choose your model and settings on the right.
                </p>
              </div>
            ) : (
              messages.map(message => (
                message.role !== 'system' && (
                  <ChatMessage key={message.id} message={message} />
                )
              ))
            )}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="glass-morphism p-4 rounded-lg">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <ModelSelector
          selectedModelId={selectedModelId}
          onModelChange={handleModelChange}
          modelParams={modelParams}
          onModelParamsChange={handleModelParamsChange}
        />
      </div>
    </div>
  );
};

export default ChatInterface; 