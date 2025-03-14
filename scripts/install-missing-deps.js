const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('Installing missing dependencies...');

// Function to safely execute commands
function safeExec(command, options = {}) {
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.warn(`Warning: Command failed: ${command}`);
    console.warn(error.message);
    return null;
  }
}

// List of missing dependencies from the error message
const missingDependencies = [
  'react-syntax-highlighter@15.5.0',
  'recharts@2.10.3',
  'lucide-react@0.294.0',
  'class-variance-authority@0.7.0'
];

// Install each missing dependency
console.log('Installing dependencies...');
missingDependencies.forEach(dep => {
  console.log(`Installing ${dep}...`);
  safeExec(`npm install ${dep} --save`);
});

// Create a patch for react-syntax-highlighter if needed
const syntaxHighlighterPatchDir = path.join(__dirname, '..', 'patches');
if (!fs.existsSync(syntaxHighlighterPatchDir)) {
  fs.mkdirSync(syntaxHighlighterPatchDir, { recursive: true });
}

const syntaxHighlighterPatchPath = path.join(syntaxHighlighterPatchDir, 'react-syntax-highlighter+15.5.0.patch');
const patchContent = `
diff --git a/node_modules/react-syntax-highlighter/dist/esm/prism-light.js b/node_modules/react-syntax-highlighter/dist/esm/prism-light.js
index 1234567..abcdef0 100644
--- a/node_modules/react-syntax-highlighter/dist/esm/prism-light.js
+++ b/node_modules/react-syntax-highlighter/dist/esm/prism-light.js
@@ -1,6 +1,6 @@
 import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
 import React from 'react';
-import refractor from 'refractor';
+import refractor from 'refractor/core';
 import { createStyleObject } from './create-element';
 import themeToDict from './theme-to-dict';
 import { createLineElement, flattenCodeTree, processLines } from './utils';
`;

try {
  fs.writeFileSync(syntaxHighlighterPatchPath, patchContent);
  console.log('Created patch for react-syntax-highlighter');
  
  // Apply the patch
  try {
    execSync('npx patch-package react-syntax-highlighter', { stdio: 'inherit' });
    console.log('Successfully applied react-syntax-highlighter patch');
  } catch (patchError) {
    console.warn('Warning: Could not apply react-syntax-highlighter patch:', patchError.message);
  }
} catch (error) {
  console.error('Error creating react-syntax-highlighter patch:', error.message);
}

// Update the .patchrc file
const patchrcPath = path.join(__dirname, '..', '.patchrc');
try {
  let patchrc = {};
  if (fs.existsSync(patchrcPath)) {
    patchrc = JSON.parse(fs.readFileSync(patchrcPath, 'utf8'));
  } else {
    patchrc = { patches: {} };
  }
  
  if (!patchrc.patches['react-syntax-highlighter']) {
    patchrc.patches['react-syntax-highlighter'] = [];
  }
  
  // Check if the patch already exists
  const patchExists = patchrc.patches['react-syntax-highlighter'].some(
    p => p.version === '15.5.0' && p.patch === 'patches/react-syntax-highlighter+15.5.0.patch'
  );
  
  if (!patchExists) {
    patchrc.patches['react-syntax-highlighter'].push({
      version: '15.5.0',
      patch: 'patches/react-syntax-highlighter+15.5.0.patch'
    });
  }
  
  fs.writeFileSync(patchrcPath, JSON.stringify(patchrc, null, 2));
  console.log('Updated .patchrc file');
} catch (error) {
  console.error('Error updating .patchrc file:', error.message);
}

console.log('Missing dependencies installation completed'); 