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
    throw new Error(`Failed to parse XML: ${error.message}`);
  }
}

/**
 * Convert a JavaScript object to XML
 */
export function buildXML(obj) {
  try {
    const builder = new Builder({
      renderOpts: { pretty: true, indent: '  ', newline: '\n' },
      xmldec: { version: '1.0', encoding: 'UTF-8' },
      headless: false
    });
    
    return builder.buildObject(obj);
  } catch (error) {
    console.error('XML building error:', error);
    throw new Error(`Failed to build XML: ${error.message}`);
  }
} 