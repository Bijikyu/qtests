/**
 * API Key Generator Utility
 * 
 * This module focuses solely on generating test API keys for testing scenarios.
 * It provides both direct key generation and HTTP endpoint testing capabilities.
 */

/**
 * Generate API key for testing scenarios
 * 
 * This function creates test API keys with optional HTTP app testing support.
 * It supports both direct key generation and API endpoint testing patterns.
 * 
 * @param {string|Object} appOrSuffix - Either an Express app for HTTP testing or a suffix string
 * @param {string} allowedApi - Optional API identifier for HTTP testing
 * @returns {Promise<string|Object>} Generated key string or HTTP response object
 */
async function generateKey(appOrSuffix, allowedApi) {
  console.log(`generateKey is running with ${typeof appOrSuffix} ${allowedApi || 'none'}`);
  
  try {
    // Check if first parameter is an Express app (has use/get/post methods)
    if (appOrSuffix && typeof appOrSuffix === 'object' && 
        (appOrSuffix.use || appOrSuffix.get || appOrSuffix.post)) {
      
      // HTTP endpoint testing mode
      try {
        const { supertest } = require('../httpTest');
        const response = await supertest(appOrSuffix)
          .post('/api/generate-key')
          .send({ allowedApi: allowedApi });
        
        console.log(`generateKey is returning HTTP response`);
        return response;
      } catch (error) {
        console.log(`generateKey HTTP test error: ${error.message}`);
        throw error;
      }
    } else {
      // Direct key generation mode
      const suffix = appOrSuffix || Date.now().toString();
      const key = `test-api-key-${suffix}`;
      
      console.log(`generateKey is returning direct key`);
      return key;
    }
  } catch (error) {
    console.log(`generateKey error ${error.message}`);
    throw error;
  }
}

module.exports = {
  generateKey
};