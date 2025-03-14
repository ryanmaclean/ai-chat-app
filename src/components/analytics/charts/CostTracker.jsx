import React from 'react';

const CostTracker = ({ data = [], totalCost = 0 }) => {
  return (
    <div className="glass-card h-[300px] p-4">
      <h3 className="text-lg font-medium mb-4 text-white">Cost Tracker</h3>
      <div className="flex flex-col h-[85%] justify-between">
        <div>
          <div className="text-3xl font-bold text-white">${totalCost.toFixed(4)}</div>
          <div className="text-sm text-gray-400 mt-1">Total cost to date</div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            {data.length > 0 && (
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
                style={{ width: `${Math.min((totalCost / 0.1) * 100, 100)}%` }}
              ></div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>$0.1</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-gray-400">Recent costs</div>
          <div className="mt-2 space-y-2">
            {(data.slice(-3) || []).map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-white">{item.date}</span>
                <span className="text-white">${item.cost.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostTracker; 