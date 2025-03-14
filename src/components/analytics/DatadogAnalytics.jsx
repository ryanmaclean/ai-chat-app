import React, { useEffect, useState } from 'react';

const DatadogAnalytics = () => {
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const dashboardId = import.meta.env.VITE_DATADOG_DASHBOARD_ID;
    const site = import.meta.env.VITE_DATADOG_SITE || 'datadoghq.com';
    
    if (dashboardId) {
      setDashboardUrl(`https://app.${site}/dashboard/${dashboardId}`);
    } else {
      console.warn('Datadog dashboard ID not configured');
    }
    
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return (
      <div className="glass-card p-4 h-full">
        <h3 className="text-lg font-medium mb-4 text-white">Datadog Analytics</h3>
        <div className="flex items-center justify-center h-64">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }
  
  if (!dashboardUrl) {
    return (
      <div className="glass-card p-4 h-full">
        <h3 className="text-lg font-medium mb-4 text-white">Datadog Analytics</h3>
        <div className="text-center text-gray-400 p-4">
          <p>Datadog dashboard is not configured.</p>
          <p className="mt-2">Set the VITE_DATADOG_DASHBOARD_ID environment variable to display metrics.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-card p-4 h-full">
      <h3 className="text-lg font-medium mb-4 text-white">Datadog Analytics</h3>
      <div className="text-sm text-gray-400 mb-4">
        <p>View detailed analytics in the Datadog dashboard:</p>
        <a 
          href={dashboardUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Open Datadog Dashboard
        </a>
      </div>
      
      <div className="glass-card p-4 bg-opacity-50">
        <h4 className="text-md font-medium mb-2 text-white">RUM Metrics</h4>
        <p className="text-sm text-gray-400">
          Real User Monitoring is active and collecting data on:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-400 mt-2">
          <li>Page load performance</li>
          <li>User interactions</li>
          <li>API calls</li>
          <li>LLM requests and responses</li>
        </ul>
      </div>
    </div>
  );
};

export default DatadogAnalytics; 