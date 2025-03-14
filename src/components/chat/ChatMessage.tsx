import React from 'react';
import { Message } from '../../types/models';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg p-4",
        isUser 
          ? "bg-blue-600 text-white" 
          : "glass-morphism text-white"
      )}>
        <ReactMarkdown
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-800 rounded px-1 py-0.5" {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
        
        {message.tokensUsed && (
          <div className="text-xs text-gray-400 mt-2">
            Tokens: {message.tokensUsed} · Cost: ${message.cost?.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 