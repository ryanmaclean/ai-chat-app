import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { sendChatMessage } from '../../api/chat';

// Add this function to calculate cost based on model and token usage
const calculateCost = (model, usage) => {
  if (!usage) return 0;
  
  // Default rates for GPT-3.5 Turbo
  let inputRate = 0.0000015;
  let outputRate = 0.000002;
  
  // Adjust rates based on model
  if (model.includes('gpt-4')) {
    inputRate = 0.00003;
    outputRate = 0.00006;
  }
  
  const inputCost = (usage.prompt_tokens || 0) * inputRate;
  const outputCost = (usage.completion_tokens || 0) * outputRate;
  
  return inputCost + outputCost;
};

const ChatContainer = ({ 
  model, 
  temperature,
  onUpdateAnalytics 
}) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [conversationHistory, setConversationHistory] = useState([
    { role: 'system', content: 'You are a helpful AI assistant.' },
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationTitle, setConversationTitle] = useState('New Conversation');
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(`session-${Date.now()}`);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (message) => {
    // Add user message to the chat
    const newMessages = [...messages, { role: 'user', content: message }];
    setMessages(newMessages);
    
    // Update conversation history
    const newHistory = [...conversationHistory, { role: 'user', content: message }];
    setConversationHistory(newHistory);
    
    setIsLoading(true);

    // Start tracking metrics with Datadog
    const startTime = Date.now();
    let traceId = null;
    
    if (window.llmobs) {
      try {
        traceId = window.llmobs.startTrace({
          type: "llm.request",
          name: "chat_completion",
          model: model,
          input: message,
          sessionId: sessionIdRef.current
        });
      } catch (error) {
        console.error("Error starting trace:", error);
      }
    }
    
    try {
      // Use the real OpenAI API with conversation history
      const data = await sendChatMessage(model, newHistory, temperature);
      
      // Record metrics with Datadog
      if (window.llmobs && traceId) {
        try {
          window.llmobs.finishTrace({
            traceId,
            output: data.choices[0].message.content,
            metrics: {
              tokens: {
                prompt: data.usage?.prompt_tokens || 0,
                completion: data.usage?.completion_tokens || 0,
                total: data.usage?.total_tokens || 0,
              },
              latency: Date.now() - startTime,
              cost: calculateCost(model, data.usage)
            },
            status: 'success'
          });
        } catch (error) {
          console.error("Error finishing trace:", error);
        }
      }
      
      const assistantMessage = { 
        role: 'assistant', 
        content: data.choices[0].message.content 
      };
      
      // Update messages for display
      setMessages([...newMessages, assistantMessage]);
      
      // Update conversation history
      setConversationHistory([...newHistory, assistantMessage]);
      
      // Update analytics if callback exists
      if (onUpdateAnalytics) {
        onUpdateAnalytics({
          model,
          inputTokens: data.usage?.prompt_tokens || 0,
          outputTokens: data.usage?.completion_tokens || 0,
          cost: calculateCost(model, data.usage),
          responseTime: Date.now() - startTime
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Record error with Datadog
      if (window.llmobs && traceId) {
        try {
          window.llmobs.finishTrace({
            traceId,
            error: error.message,
            status: 'error'
          });
        } catch (traceError) {
          console.error("Error finishing trace with error:", traceError);
        }
      }
      
      // Fallback to a mock response if the API call fails
      const errorMessage = { 
        role: 'assistant', 
        content: `I'm sorry, I couldn't process your request. Error: ${error.message}` 
      };
      
      setMessages([...newMessages, errorMessage]);
      setConversationHistory([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportChat = () => {
    if (window.llmobs) {
      return window.llmobs.trace({ 
        kind: 'task', 
        name: 'exportChatHistory',
        sessionId: sessionIdRef.current
      }, () => {
        exportChatContent();
      });
    } else {
      exportChatContent();
    }
  };
  
  const exportChatContent = () => {
    const chatContent = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversationTitle.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Annotate the export action if llmobs exists
    if (window.llmobs) {
      try {
        window.llmobs.annotate({
          metadata: {
            messageCount: messages.length,
            exportFormat: 'txt',
            conversationTitle
          }
        });
      } catch (error) {
        console.error("Error annotating export:", error);
      }
    }
  };
  
  return (
    <div className="glass-card h-[calc(100vh-200px)] flex flex-col">
      <ChatHeader 
        title={conversationTitle} 
        onTitleChange={setConversationTitle} 
        onExport={handleExportChat} 
      />
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p className="text-center">
              Start a conversation with the AI.<br />
              Choose your model and settings from the controls below.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage 
              key={`msg-${index}-${message.role}`} 
              message={message} 
            />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="glass-card p-4 rounded-lg">
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
  );
};

export default ChatContainer; 