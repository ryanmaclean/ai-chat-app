import React, { useState, useEffect } from 'react';

const SecurityStatus = () => {
  const [sbomStatus, setSbomStatus] = useState('loading');
  const [vulnerabilities, setVulnerabilities] = useState([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll simulate a fetch
    const fetchSecurityStatus = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in production this would come from Datadog API
        setSbomStatus('secure');
        setVulnerabilities([]);
      } catch (error) {
        console.error('Error fetching security status:', error);
        setSbomStatus('error');
      }
    };
    
    fetchSecurityStatus();
  }, []);
  
  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-medium mb-4">Security Status</h3>
      
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          sbomStatus === 'secure' ? 'bg-green-500' :
          sbomStatus === 'warning' ? 'bg-yellow-500' :
          sbomStatus === 'critical' ? 'bg-red-500' :
          'bg-gray-500'
        }`}></div>
        <span>
          {sbomStatus === 'secure' ? 'All dependencies secure' :
           sbomStatus === 'warning' ? 'Minor vulnerabilities detected' :
           sbomStatus === 'critical' ? 'Critical vulnerabilities detected' :
           sbomStatus === 'loading' ? 'Checking dependencies...' :
           'Error checking dependencies'}
        </span>
      </div>
      
      <div className="text-sm">
        <p>SBOM monitoring powered by <a href="https://github.com/DataDog/osv-scanner" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Datadog OSV-Scanner</a></p>
      </div>
      
      {vulnerabilities.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Detected Vulnerabilities:</h4>
          <ul className="text-sm space-y-1">
            {vulnerabilities.map((vuln, index) => (
              <li key={index} className="text-red-400">
                {vuln.package}: {vuln.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SecurityStatus; 