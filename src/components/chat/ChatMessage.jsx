import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter, vscDarkPlus } from '../../utils/syntax-highlighter-compat';

const ChatMessage = ({ message }) => {
  const { role, content } = message;
  
  // Determine if this is a user or assistant message
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'bg-[rgba(59,130,246,0.15)]' : 'bg-[rgba(255,255,255,0.07)]'} backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-lg p-3`}>
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center mr-2">
            {isUser ? '👤' : '🤖'}
          </div>
          <span className="text-sm font-medium text-white">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
        </div>
        <div className="text-white">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                    className="rounded-md my-2"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={`${className} bg-[rgba(0,0,0,0.3)] px-1 py-0.5 rounded`} {...props}>
                    {children}
                  </code>
                );
              },
              p: ({ children }) => <p className="mb-2">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
                  {children}
                </a>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 