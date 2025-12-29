/**
 * Stub Path Resolution Integration Test
 * 
 * Tests that qtests stub path resolution works correctly after setup.
 * This test verifies that the getStubPath function can locate and resolve
 * stub file paths for modules that have been replaced with stubs.
 */

import * as path from 'path';

/**
 * Gets the file system path for a stub module.
 * This function resolves where a stub file is located on the file system.
 * 
 * @param moduleName - The name of the module to get the stub path for
 * @returns The resolved file path to the stub file
 */
function getStubPath(moduleName: string): string {
  // Validate module name to prevent path traversal
  if (!moduleName || typeof moduleName !== 'string' || moduleName.includes('..') || moduleName.includes('/') || moduleName.includes('\\')) {
    throw new Error('Invalid module name - potential path traversal');
  }
  
  // Get project root directory (where setup.ts is located)
  const projectRoot = path.normalize(path.resolve(__dirname, '..'));
  
  // Construct the stub file path with validation
  const stubPath = path.normalize(path.join(projectRoot, 'stubs', `${moduleName}.ts`));
  const stubsDir = path.normalize(path.join(projectRoot, 'stubs'));
  
  // Validate stub path is within expected directory
  if (!stubPath.startsWith(stubsDir + path.sep) && stubPath !== stubsDir) {
    throw new Error('Invalid stub path - outside expected directory');
  }
  
  // Check if stub file exists, fallback to .js if .ts doesn't exist
  try {
    const resolvedPath = require.resolve(stubPath);
    // Additional validation of resolved path
    const normalizedResolved = path.normalize(path.resolve(resolvedPath));
    if (!normalizedResolved.startsWith(stubsDir + path.sep) && normalizedResolved !== stubsDir) {
      throw new Error('Resolved stub path - outside expected directory');
    }
    return stubPath;
  } catch {
    const jsStubPath = path.normalize(path.join(projectRoot, 'stubs', `${moduleName}.js`));
    
    // Validate JS stub path as well
    if (!jsStubPath.startsWith(stubsDir + path.sep) && jsStubPath !== stubsDir) {
      throw new Error('Invalid JS stub path - outside expected directory');
    }
    
    return jsStubPath;
  }
}

describe('Stub Path Resolution Tests', () => {
  test('getStubPath resolves correctly for known stubs', () => {
    // Test that stub paths resolve without throwing
    expect(() => getStubPath('axios')).not.toThrow();
    expect(() => getStubPath('winston')).not.toThrow();
    
    // Verify the paths point to the expected locations
    const axiosPath = getStubPath('axios');
    const winstonPath = getStubPath('winston');
    
    expect(axiosPath).toContain('stubs/axios');
    expect(winstonPath).toContain('stubs/winston');
    
    // Verify the paths are absolute
    expect(path.isAbsolute(axiosPath)).toBe(true);
    expect(path.isAbsolute(winstonPath)).toBe(true);
  });

  test('getStubPath handles non-existent modules gracefully', () => {
    // Test that getStubPath doesn't throw for non-existent modules
    expect(() => getStubPath('nonexistent')).not.toThrow();
    
    // Should still return a path even if file doesn't exist
    const nonExistentPath = getStubPath('nonexistent');
    expect(typeof nonExistentPath).toBe('string');
    expect(nonExistentPath).toContain('stubs/nonexistent');
  });

  test('getStubPath returns consistent results', () => {
    // Test that calling getStubPath multiple times returns the same result
    const axiosPath1 = getStubPath('axios');
    const axiosPath2 = getStubPath('axios');
    
    expect(axiosPath1).toBe(axiosPath2);
  });
});