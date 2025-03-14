import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResponseTimeChart = ({ data = [] }) => {
  // If no data is provided, use sample data
  const chartData = data.length > 0 ? data : [
    { timestamp: '10:00 AM', time: 1200 },
    { timestamp: '10:15 AM', time: 800 },
    { timestamp: '10:30 AM', time: 1500 },
    { timestamp: '10:45 AM', time: 1000 },
    { timestamp: '11:00 AM', time: 1300 }
  ];

  return (
    <div className="glass-card h-[300px]">
      <h3 className="text-lg font-medium mb-4 text-white">Response Time</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickFormatter={(value) => `${value}ms`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 25, 40, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.125)',
              color: 'white'
            }}
            formatter={(value) => [`${value}ms`, 'Response Time']}
          />
          <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
          <Line 
            type="monotone" 
            dataKey="time" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart; 