/**
 * Path Validator Unit Tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { 
  validateSecurePath, 
  VALIDATORS, 
  PathValidationOptions
} from '../pathValidator.js';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');
const mockFs = jest.mocked(fs);

describe('Path Validator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateSecurePath', () => {
    it('should accept valid absolute paths', () => {
      const testPath = '/home/user/documents/file.txt';
      const options: PathValidationOptions = {};

      const result = validateSecurePath(testPath, '/home', options);

      expect(result).toBe('/home/user/documents/file.txt');
    });

    it('should reject path traversal attempts', () => {
      const dangerousPath = '../../../etc/passwd';
      const options: PathValidationOptions = {};

      expect(() => {
        validateSecurePath(dangerousPath, '/home', options);
      }).toThrow();
    });

    it('should reject null byte injection', () => {
      const maliciousPath = '/home/user/file\x00.txt';
      const options: PathValidationOptions = {};

      expect(() => {
        validateSecurePath(maliciousPath, '/home', options);
      }).toThrow();
    });

    it('should validate file extensions when specified', () => {
      const testPath = '/home/user/document.pdf';
      const options: PathValidationOptions = {
        allowedExtensions: ['.txt', '.md']
      };

      expect(() => {
        validateSecurePath(testPath, '/home', options);
      }).toThrow('File extension');
    });

    it('should allow valid file extensions', () => {
      const testPath = '/home/user/document.txt';
      const options: PathValidationOptions = {
        allowedExtensions: ['.txt', '.md']
      };

      const result = validateSecurePath(testPath, '/home', options);

      expect(result).toBe('/home/user/document.txt');
    });

    it('should check file existence when required', () => {
      const testPath = '/home/user/nonexistent.txt';
      const options: PathValidationOptions = {
        mustExist: true
      };

      mockFs.existsSync.mockReturnValue(false);

      expect(() => {
        validateSecurePath(testPath, '/home', options);
      }).toThrow('does not exist');
    });

    it('should pass when file exists and is required', () => {
      const testPath = '/home/user/existing.txt';
      const options: PathValidationOptions = {
        mustExist: true
      };

      mockFs.existsSync.mockReturnValue(true);

      const result = validateSecurePath(testPath, '/home', options);

      expect(result).toBe('/home/user/existing.txt');
    });

    it('should reject relative paths when not allowed', () => {
      const relativePath = 'documents/file.txt';
      const options: PathValidationOptions = {
        allowRelative: false
      };

      expect(() => {
        validateSecurePath(relativePath, '/home', options);
      }).toThrow('relative paths are not allowed');
    });

    it('should allow relative paths when permitted', () => {
      const relativePath = 'documents/file.txt';
      const options: PathValidationOptions = {
        allowRelative: true
      };

      const result = validateSecurePath(relativePath, '/home', options);

      expect(result).toBe('/home/documents/file.txt');
    });

    it('should normalize paths before validation', () => {
      const messyPath = '/home/user//documents/./file.txt';
      const options: PathValidationOptions = {};

      const result = validateSecurePath(messyPath, '/home', options);

      expect(result).toBe('/home/user/documents/file.txt');
    });
  });

  describe('VALIDATORS', () => {
    it('should have stub file validator', () => {
      expect(VALIDATORS.stubFile).toBeDefined();
      
      mockFs.existsSync.mockReturnValue(true);
      const result = VALIDATORS.stubFile('/home/user/project/stubs/axios.js');
      expect(result).toContain('stubs');
    });

    it('should have mock file validator', () => {
      expect(VALIDATORS.mockFile).toBeDefined();
      
      mockFs.existsSync.mockReturnValue(true);
      const result = VALIDATORS.mockFile('/home/user/project/__mocks__/axios.js');
      expect(result).toContain('__mocks__');
    });

    it('should have config file validator', () => {
      expect(VALIDATORS.configFile).toBeDefined();
      
      const result = VALIDATORS.configFile('package.json');
      expect(result).toContain('package.json');
    });

    it('should have test data validator', () => {
      expect(VALIDATORS.testData).toBeDefined();
      
      const result = VALIDATORS.testData('tests/test.spec.js');
      expect(result).toContain('tests');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      expect(() => {
        validateSecurePath('', '/home');
      }).toThrow('must be a non-empty string');
    });

    it('should handle null/undefined input', () => {
      expect(() => {
        validateSecurePath(null as any, '/home');
      }).toThrow();
      expect(() => {
        validateSecurePath(undefined as any, '/home');
      }).toThrow();
    });

    it('should handle special characters in paths', () => {
      const specialPath = '/home/user/file with spaces & symbols.txt';
      const result = validateSecurePath(specialPath, '/home');

      expect(result).toContain('file with spaces & symbols.txt');
    });
  });
});