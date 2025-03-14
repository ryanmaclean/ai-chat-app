import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TokenUsageData {
  date: string;
  input: number;
  output: number;
}

interface TokenUsageChartProps {
  data: TokenUsageData[];
}

const TokenUsageChart: React.FC<TokenUsageChartProps> = ({ data }) => {
  return (
    <div className="glass-morphism p-4 rounded-lg h-[300px]">
      <h3 className="text-lg font-medium mb-4">Token Usage</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 25, 40, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.125)',
              color: 'white'
            }} 
          />
          <Legend />
          <Bar dataKey="input" name="Input Tokens" fill="#3b82f6" />
          <Bar dataKey="output" name="Output Tokens" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenUsageChart; 