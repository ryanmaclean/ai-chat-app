const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('Fixing Vite version compatibility issues...');

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

// Install the correct version of Vite
console.log('Installing Vite 6.2.1...');
safeExec('npm install vite@6.2.1 --save-dev');

// Update the @vitejs/plugin-react to a compatible version
console.log('Installing compatible React plugin...');
safeExec('npm install @vitejs/plugin-react@4.2.1 --save-dev');

// Update the .patchrc file to remove Vite patch
const patchrcPath = path.join(__dirname, '..', '.patchrc');
try {
  if (fs.existsSync(patchrcPath)) {
    const patchrc = JSON.parse(fs.readFileSync(patchrcPath, 'utf8'));
    
    // Remove Vite patch if it exists
    if (patchrc.patches && patchrc.patches.vite) {
      delete patchrc.patches.vite;
      fs.writeFileSync(patchrcPath, JSON.stringify(patchrc, null, 2));
      console.log('Removed Vite patch from .patchrc');
    }
  }
} catch (error) {
  console.error('Error updating .patchrc file:', error.message);
}

// Remove the Vite patch file if it exists
const vitePatchPath = path.join(__dirname, '..', 'patches', 'vite+6.5.0.patch');
if (fs.existsSync(vitePatchPath)) {
  fs.unlinkSync(vitePatchPath);
  console.log('Removed Vite patch file');
}

console.log('Vite version fixed successfully'); 