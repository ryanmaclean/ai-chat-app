import React from 'react';
import { 
  TokenUsageChart, 
  CostTracker, 
  ResponseTimeChart, 
  ModelUsageChart,
  CostChart
} from './charts';
import DatadogAnalytics from './DatadogAnalytics';
import SecurityStatus from '../security/SecurityStatus';

const AnalyticsDashboard = ({ data }) => {
  // Calculate totals
  const totalInputTokens = data.tokenUsage.reduce((sum, day) => sum + day.input, 0);
  const totalOutputTokens = data.tokenUsage.reduce((sum, day) => sum + day.output, 0);
  const totalCost = data.costData.reduce((sum, day) => sum + day.cost, 0);
  const averageResponseTime = data.responseTimeData.length > 0
    ? data.responseTimeData.reduce((sum, item) => sum + item.time, 0) / data.responseTimeData.length
    : 0;
  
  // Prepare model usage data for chart
  const modelUsageData = Object.entries(data.modelUsage).map(([name, count]) => ({
    name,
    value: count
  }));
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-card">
            <h3 className="text-lg font-medium mb-2">Usage Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Total Input Tokens</p>
                <p className="text-2xl font-bold">{totalInputTokens.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Output Tokens</p>
                <p className="text-2xl font-bold">{totalOutputTokens.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Cost</p>
                <p className="text-2xl font-bold">${totalCost.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg. Response Time</p>
                <p className="text-2xl font-bold">{averageResponseTime.toFixed(0)}ms</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <DatadogAnalytics />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TokenUsageChart data={data.tokenUsage} />
            <CostTracker data={data.costData} totalCost={totalCost} />
          </div>
        </div>
        <div className="md:col-span-1">
          <SecurityStatus />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResponseTimeChart data={data.responseTimeData} averageTime={averageResponseTime} />
        <ModelUsageChart data={modelUsageData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CostChart data={data.costData} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 