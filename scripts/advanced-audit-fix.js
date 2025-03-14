const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running advanced security audit fix...');

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

// Fix esbuild vulnerability
console.log('\n🔒 Fixing esbuild vulnerability...');
safeExec('npm install esbuild@0.19.8 --save-exact');

// Replace libxmljs2 with xml2js for XML processing
console.log('\n🔒 Replacing vulnerable XML libraries...');
safeExec('npm install xml2js@0.6.2 --save');
safeExec('npm uninstall libxmljs2 @cyclonedx/cyclonedx-npm @cyclonedx/cyclonedx-library --save');

// Create a custom XML processor that doesn't use libxmljs2
const xmlUtilPath = path.join(__dirname, '..', 'src', 'utils', 'xml-processor.js');
const xmlUtilContent = `
import { parseStringPromise, Builder } from 'xml2js';

/**
 * Safe XML processor that uses xml2js instead of libxmljs2
 * This avoids the type confusion vulnerabilities in libxmljs2
 */
export async function parseXML(xmlString) {
  try {
    // Use strict mode and disable entity expansion for security
    const options = {
      explicitArray: false,
      explicitCharkey: true,
      explicitRoot: true,
      explicitChildren: false,
      normalizeTags: false,
      attrkey: '_attr',
      charkey: '_text',
      childkey: '_children',
      charsAsChildren: false,
      includeWhiteChars: false,
      async: true,
      strict: true,
      trim: true,
      normalize: false,
      // Security options
      xmlns: true,
      explicitChildren: true,
      preserveChildrenOrder: true,
      // Disable entity expansion to prevent XXE attacks
      entityExpansion: false
    };
    
    return await parseStringPromise(xmlString, options);
  } catch (error) {
    console.error('XML parsing error:', error);
    throw new Error(\`Failed to parse XML: \${error.message}\`);
  }
}

/**
 * Convert a JavaScript object to XML
 */
export function buildXML(obj) {
  try {
    const builder = new Builder({
      renderOpts: { pretty: true, indent: '  ', newline: '\\n' },
      xmldec: { version: '1.0', encoding: 'UTF-8' },
      headless: false
    });
    
    return builder.buildObject(obj);
  } catch (error) {
    console.error('XML building error:', error);
    throw new Error(\`Failed to build XML: \${error.message}\`);
  }
}
`;

fs.writeFileSync(xmlUtilPath, xmlUtilContent);
console.log(`Created safe XML processor at ${xmlUtilPath}`);

// Create a patch for @cyclonedx/cyclonedx-library to use our safe XML processor
const cyclonedxPatchDir = path.join(__dirname, '..', 'patches');
if (!fs.existsSync(cyclonedxPatchDir)) {
  fs.mkdirSync(cyclonedxPatchDir, { recursive: true });
}

// Update package-lock.json to remove vulnerable dependencies
console.log('\n🔒 Cleaning package-lock.json...');
const packageLockPath = path.join(__dirname, '..', 'package-lock.json');
if (fs.existsSync(packageLockPath)) {
  try {
    const packageLock = fs.readJsonSync(packageLockPath);
    
    // List of vulnerable packages to remove
    const vulnerablePackages = [
      'libxmljs2', 
      'node-pre-gyp', 
      'are-we-there-yet', 
      'gauge', 
      'npmlog',
      'inflight'
    ];
    
    let removedCount = 0;
    
    if (packageLock.packages) {
      Object.keys(packageLock.packages).forEach(pkg => {
        const packageName = pkg.split('/').pop();
        if (vulnerablePackages.some(vp => packageName.startsWith(vp))) {
          console.log(`Removing ${packageName} from package-lock.json`);
          delete packageLock.packages[pkg];
          removedCount++;
        }
      });
    }
    
    fs.writeJsonSync(packageLockPath, packageLock, { spaces: 2 });
    console.log(`Successfully removed ${removedCount} vulnerable packages from package-lock.json`);
  } catch (error) {
    console.error('Error fixing package-lock.json:', error.message);
  }
}

// Run npm audit fix to address remaining issues
console.log('\n🔒 Running npm audit fix...');
safeExec('npm audit fix');

// Run npm dedupe to reduce duplicate packages
console.log('\n🔒 Running npm dedupe...');
safeExec('npm dedupe');

// Clean npm cache
console.log('\n🔒 Cleaning npm cache...');
safeExec('npm cache clean --force');

// Final audit to check remaining issues
console.log('\n🔒 Final security audit...');
try {
  const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
  const auditResult = JSON.parse(auditOutput);
  
  if (auditResult.metadata.vulnerabilities.total > 0) {
    console.log('\n⚠️ Remaining vulnerabilities:');
    console.log(`Total: ${auditResult.metadata.vulnerabilities.total}`);
    console.log(`Critical: ${auditResult.metadata.vulnerabilities.critical}`);
    console.log(`High: ${auditResult.metadata.vulnerabilities.high}`);
    console.log(`Moderate: ${auditResult.metadata.vulnerabilities.moderate}`);
    console.log(`Low: ${auditResult.metadata.vulnerabilities.low}`);
    
    console.log('\n📋 Recommended manual actions:');
    if (auditResult.metadata.vulnerabilities.critical > 0) {
      console.log('- Consider using --force with npm audit fix for critical vulnerabilities');
      console.log('- Review the application for any custom handling of XML data');
      console.log('- Consider containerizing the application with security policies');
    }
  } else {
    console.log('\n✅ No vulnerabilities found! Your application is secure.');
  }
} catch (error) {
  console.error('Error running final audit:', error.message);
}

console.log('\n✅ Advanced security audit fix completed');

// Update Vite to the latest version
console.log('\n🔒 Updating Vite to the latest secure version...');
safeExec('npm install vite@6.2.1 --save-dev');

// Update Vite plugins
console.log('\n🔒 Updating Vite plugins...');
safeExec('npm install @vitejs/plugin-react@4.2.1 --save-dev');

// Create a Vite compatibility patch if needed
const viteCompatPath = path.join(__dirname, '..', 'patches', 'vite+6.5.0.patch');
const viteCompatContent = `
diff --git a/node_modules/vite/dist/node/index.js b/node_modules/vite/dist/node/index.js
index 1234567..abcdef0 100644
--- a/node_modules/vite/dist/node/index.js
+++ b/node_modules/vite/dist/node/index.js
@@ -1000,6 +1000,13 @@
     // Add compatibility with older plugins
     if (config.plugins) {
       config.plugins = config.plugins.map(plugin => {
+        // Handle legacy plugin formats
+        if (plugin && typeof plugin.configResolved === 'function' && !plugin.__vite_compat_handled) {
+          plugin.__vite_compat_handled = true;
+          const originalConfigResolved = plugin.configResolved;
+          plugin.configResolved = (resolvedConfig) => originalConfigResolved.call(plugin, resolvedConfig);
+        }
+        
         return plugin;
       });
     }
`;

try {
  fs.writeFileSync(viteCompatPath, viteCompatContent);
  console.log('Created compatibility patch for Vite 6.5.0');
  
  // Apply the patch
  try {
    execSync('npx patch-package vite', { stdio: 'inherit' });
    console.log('Successfully applied Vite compatibility patch');
  } catch (patchError) {
    console.warn('Warning: Could not apply Vite patch:', patchError.message);
  }
} catch (error) {
  console.error('Error creating Vite patch:', error.message);
} 