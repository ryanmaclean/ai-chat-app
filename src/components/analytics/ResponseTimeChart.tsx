import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ResponseTimeData {
  timestamp: string;
  time: number; // in milliseconds
}

interface ResponseTimeChartProps {
  data: ResponseTimeData[];
  averageTime: number;
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ data, averageTime }) => {
  return (
    <div className="glass-morphism p-4 rounded-lg h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Response Time</h3>
        <div className="text-lg">Avg: {averageTime.toFixed(0)}ms</div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 25, 40, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.125)',
              color: 'white'
            }} 
            formatter={(value) => [`${value}ms`, 'Response Time']}
          />
          <Area type="monotone" dataKey="time" stroke="#8b5cf6" fill="#8b5cf680" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart; 