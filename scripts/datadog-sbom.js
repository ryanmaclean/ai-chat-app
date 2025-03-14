const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

console.log('Generating SBOM using Datadog SCA...');

// Get Datadog API key from environment
const DD_API_KEY = process.env.VITE_DATADOG_API_KEY || '';
const DD_APP_ID = process.env.VITE_DATADOG_APP_ID || '';
const DD_SITE = process.env.VITE_DATADOG_SITE || 'datadoghq.com';
const PROJECT_NAME = process.env.VITE_DATADOG_SBOM_PROJECT_NAME || 'ai-chat-app';

if (!DD_API_KEY) {
  console.error('Error: Datadog API key not found. Set VITE_DATADOG_API_KEY in your .env file.');
  process.exit(1);
}

// Generate dependency tree
console.log('Generating dependency tree...');
const packageJson = require('../package.json');
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

// Create SBOM data structure
const sbomData = {
  name: PROJECT_NAME,
  version: packageJson.version || '1.0.0',
  dependencies: [],
  metadata: {
    tools: [
      {
        name: 'Datadog SCA',
        version: '1.0.0'
      }
    ],
    timestamp: new Date().toISOString()
  }
};

// Add dependencies to SBOM
Object.entries(dependencies).forEach(([name, version]) => {
  // Clean up version string (remove ^ or ~ if present)
  const cleanVersion = version.replace(/[\^~]/, '');
  
  sbomData.dependencies.push({
    name,
    version: cleanVersion,
    type: packageJson.dependencies[name] ? 'production' : 'development'
  });
});

// Write SBOM to file
const sbomPath = path.join(__dirname, '..', 'sbom.json');
fs.writeJsonSync(sbomPath, sbomData, { spaces: 2 });
console.log(`SBOM generated at ${sbomPath}`);

// Upload SBOM to Datadog if enabled
if (process.env.VITE_DATADOG_SBOM_ENABLED === 'true' && DD_API_KEY && DD_APP_ID) {
  console.log('Uploading SBOM to Datadog...');
  
  const sbomContent = fs.readFileSync(sbomPath, 'utf8');
  
  const options = {
    hostname: `api.${DD_SITE}`,
    path: '/api/v2/security/sbom',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'DD-API-KEY': DD_API_KEY,
      'DD-APPLICATION-KEY': DD_APP_ID
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('SBOM successfully uploaded to Datadog');
      } else {
        console.error(`Error uploading SBOM to Datadog: ${res.statusCode}`);
        console.error(data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('Error uploading SBOM to Datadog:', error.message);
  });
  
  req.write(JSON.stringify({
    sbom: sbomContent,
    project: PROJECT_NAME,
    version: packageJson.version || '1.0.0'
  }));
  
  req.end();
} else {
  console.log('Skipping Datadog SBOM upload (not enabled or missing credentials)');
}

console.log('SBOM generation completed'); 