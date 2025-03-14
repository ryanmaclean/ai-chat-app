import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CostData {
  date: string;
  cost: number;
}

interface CostTrackerProps {
  data: CostData[];
  totalCost: number;
}

const CostTracker: React.FC<CostTrackerProps> = ({ data, totalCost }) => {
  return (
    <div className="glass-morphism p-4 rounded-lg h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Cost Tracking</h3>
        <div className="text-xl font-bold">${totalCost.toFixed(4)}</div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 25, 40, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.125)',
              color: 'white'
            }} 
            formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Cost']}
          />
          <Legend />
          <Line type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostTracker; 