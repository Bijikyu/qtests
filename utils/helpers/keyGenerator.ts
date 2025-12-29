/**
 * Key Generation Utility - TypeScript Implementation
 * 
 * This module provides functionality for generating random keys and identifiers
 * for testing scenarios where unique values are needed.
 */

import { randomBytes } from 'crypto';

/**
 * Generate a random key for testing purposes
 * 
 * This function creates a random string that can be used as API keys,
 * session tokens, or other identifiers in testing scenarios where
 * unique values are required.
 * 
 * @param lengthOrType - Length of the generated key (number) or type descriptor (string) for testing
 * @param prefix - Optional prefix to add to the generated key
 * @returns Random key string suitable for testing
 */
function generateKey(lengthOrType: number | string = 32, prefix?: string): string {
  console.log(`generateKey is running with lengthOrType ${lengthOrType} and prefix ${prefix || 'none'}`);
  
  try {
    // Handle testing scenario with type descriptor
    if (typeof lengthOrType === 'string') {
      // Validate string input to prevent injection
      if (lengthOrType.length > 100) {
        throw new Error('Test key type descriptor too long');
      }
      const testKey = `test-api-key-${lengthOrType}`;
      console.log(`generateKey is returning test key with length ${testKey.length}`);
      return testKey;
    }
    
    // Handle normal scenario with numeric length
    const length = lengthOrType as number;
    
    // Validate input to prevent infinite loops
    if (!Number.isInteger(length) || length <= 0) {
      throw new Error('Invalid key length: must be a positive integer');
    }
    
    // Character set for generating random keys
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    // Generate cryptographically secure random characters
    // Each character needs 2 bytes for proper distribution, so allocate length * 2
    const randomBuffer = randomBytes(length * 2);
    for (let i = 0; i < length; i++) {
      const byteIndex = i * 2;
      // Safe buffer access - we know buffer has length * 2 bytes, and byteIndex + 1 <= (length-1)*2 + 1 = length*2 - 1
      const byte1 = randomBuffer[byteIndex];
      const byte2 = randomBuffer[byteIndex + 1];
      result += chars.charAt((byte1 + byte2 * 256) % chars.length);
    }
    
    // Add prefix if provided
    const finalKey = prefix ? `${prefix}_${result}` : result;
    
    console.log(`generateKey is returning key with length ${finalKey.length}`);
    return finalKey;
    
  } catch (err: any) {
    console.log(`generateKey error ${err.message}`);
    throw err;
  }
}

// Export key generation utilities using ES module syntax
export {
  generateKey
};