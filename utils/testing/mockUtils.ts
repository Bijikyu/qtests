/**
 * Mock Utils Utility
 * Provides common mock restoration patterns with error handling
 */

/**
 * Safely restores a mock with validation
 * Replaces the common pattern of manual mock restoration with validation
 * 
 * @param mock - Mock object with mockRestore method
 * @param context - Context name for error logging
 */
export function safeRestoreMock(mock: any, context: string): void {
  try {
    if (mock && 'mockRestore' in mock && typeof mock.mockRestore === 'function') {
      mock.mockRestore();
    }
  } catch (error) {
    console.warn(`Failed to restore mock in ${context}:`, error);
  }
}

/**
 * Restores multiple mocks safely
 * @param mocks - Array of mock objects
 * @param context - Context name for error logging
 */
export function safeRestoreMocks(mocks: any[], context: string): void {
  mocks.forEach((mock, index) => {
    safeRestoreMock(mock, `${context}[${index}]`);
  });
}

/**
 * Creates a mock restore function that can be called later
 * @param mock - Mock object to restore
 * @param context - Context name for error logging
 * @returns Function that restores the mock when called
 */
export function createRestoreFunction(mock: any, context: string): () => void {
  return () => safeRestoreMock(mock, context);
}