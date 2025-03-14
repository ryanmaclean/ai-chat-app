import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ModelUsageChart = ({ data = [] }) => {
  // If no data is provided, use sample data
  const chartData = data.length > 0 ? data : [
    { name: 'gpt-3.5-turbo', usage: 150 },
    { name: 'gpt-4', usage: 75 },
    { name: 'claude-2', usage: 50 },
    { name: 'claude-instant', usage: 25 }
  ];

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">Model Usage</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="usage" fill="#8884d8" name="Requests" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ModelUsageChart; 