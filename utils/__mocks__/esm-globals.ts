// Mock for esm-globals to avoid import.meta issues in Jest
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// For Jest testing, we'll use process.cwd() as fallback since import.meta is problematic
const mockUrl = `file://${process.cwd()}/utils/esm-globals.ts`;

export const __filename = fileURLToPath(mockUrl);
export const __dirname = dirname(__filename);

export function getModuleFilename(importMetaUrl: string) {
  try {
    return fileURLToPath(importMetaUrl);
  } catch (error) {
    // Fallback for Jest environment
    return path.resolve(process.cwd(), 'mock-file.ts');
  }
}

export function getModuleDirname(importMetaUrl: string) {
  try {
    return dirname(fileURLToPath(importMetaUrl));
  } catch (error) {
    // Fallback for Jest environment - return the directory of the calling module
    return process.cwd();
  }
}