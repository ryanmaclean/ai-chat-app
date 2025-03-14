import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TokenUsageChart = ({ data = [] }) => {
  // If no data is provided, use sample data
  const chartData = data.length > 0 ? data : [
    { date: '2023-03-01', input: 1200, output: 800 },
    { date: '2023-03-02', input: 1500, output: 1000 },
    { date: '2023-03-03', input: 1000, output: 600 },
    { date: '2023-03-04', input: 1800, output: 1200 },
    { date: '2023-03-05', input: 2000, output: 1500 }
  ];

  return (
    <div className="glass-card h-[300px]">
      <h3 className="text-lg font-medium mb-4 text-white">Token Usage</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
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
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 25, 40, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.125)',
              color: 'white'
            }}
          />
          <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
          <Bar dataKey="input" name="Input Tokens" fill="#3b82f6" />
          <Bar dataKey="output" name="Output Tokens" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenUsageChart; 