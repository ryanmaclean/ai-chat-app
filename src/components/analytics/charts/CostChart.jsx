import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CostChart = ({ data = [] }) => {
  // If no data is provided, use sample data
  const chartData = data.length > 0 ? data : [
    { date: '2023-03-01', cost: 0.05 },
    { date: '2023-03-02', cost: 0.07 },
    { date: '2023-03-03', cost: 0.04 },
    { date: '2023-03-04', cost: 0.09 },
    { date: '2023-03-05', cost: 0.11 }
  ];

  return (
    <div className="glass-card h-[300px]">
      <h3 className="text-lg font-medium mb-4 text-white">Cost Over Time</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 25, 40, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.125)',
              color: 'white'
            }}
            formatter={(value) => [`$${value.toFixed(4)}`, 'Cost']}
          />
          <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
          <Line 
            type="monotone" 
            dataKey="cost" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostChart; 