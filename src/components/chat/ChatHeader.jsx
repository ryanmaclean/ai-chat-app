import React, { useState } from 'react';

const ChatHeader = ({ title, onTitleChange, onExport }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onTitleChange(editedTitle);
    setIsEditing(false);
  };
  
  return (
    <div className="flex justify-between items-center mb-4">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md p-1 text-sm w-full"
            autoFocus
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <h2 
          className="text-xl font-bold truncate cursor-pointer hover:text-blue-400" 
          onClick={() => setIsEditing(true)}
          title="Click to edit"
        >
          {title}
        </h2>
      )}
      
      <div>
        <button
          onClick={onExport}
          className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
        >
          Export Chat
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 