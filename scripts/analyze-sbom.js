const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the SBOM file
const sbomPath = path.join(__dirname, '..', 'sbom.json');
const sbomData = JSON.parse(fs.readFileSync(sbomPath, 'utf8'));

// Extract dependencies
const dependencies = sbomData.components || [];

console.log(`Found ${dependencies.length} dependencies in SBOM`);

// Send to Datadog for vulnerability tracking
const datadogApiKey = process.env.VITE_DATADOG_API_KEY;
const datadogSite = process.env.VITE_DATADOG_SITE || 'datadoghq.com';

if (datadogApiKey) {
  const options = {
    hostname: `api.${datadogSite}`,
    path: '/api/v2/security_monitoring/sbom',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'DD-API-KEY': datadogApiKey
    }
  };

  const req = https.request(options, (res) => {
    console.log(`SBOM upload status: ${res.statusCode}`);
    res.on('data', (d) => {
      console.log(JSON.parse(d));
    });
  });

  req.on('error', (error) => {
    console.error('Error uploading SBOM:', error);
  });

  req.write(JSON.stringify({
    sbom: sbomData,
    project: process.env.VITE_DATADOG_SBOM_PROJECT_NAME || 'ai-chat-app'
  }));
  req.end();
} else {
  console.log('Datadog API key not found. Skipping SBOM upload.');
} 