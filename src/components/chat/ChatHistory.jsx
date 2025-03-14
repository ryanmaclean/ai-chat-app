import React from 'react';

const ChatHistory = ({ conversations, activeConversationId, onSelectConversation, onDeleteConversation, onNewChat }) => {
  return (
    <div className="glass-card h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Chat History</h3>
        <button 
          onClick={onNewChat}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
        >
          New Chat
        </button>
      </div>
      
      <div className="space-y-2">
        {conversations.length === 0 ? (
          <p className="text-gray-400 text-sm">No conversations yet</p>
        ) : (
          conversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                conversation.id === activeConversationId 
                  ? 'bg-gray-700' 
                  : 'hover:bg-gray-800'
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="truncate">
                <p className="text-sm font-medium">{conversation.title}</p>
                <p className="text-xs text-gray-400">
                  {new Date(conversation.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
                className="text-gray-400 hover:text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory; 