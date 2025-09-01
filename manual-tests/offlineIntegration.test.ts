// Simplified offline integration tests for TypeScript ES modules
import { isOfflineMode, setOfflineMode } from '../utils/offlineMode.js';

describe('Offline Integration Tests', () => {
  test('offline mode can be toggled', () => {
    const initialState = isOfflineMode();
    setOfflineMode(!initialState);
    expect(isOfflineMode()).toBe(!initialState);
    setOfflineMode(initialState); // Restore
  });

  test('offline mode functions exist', () => {
    expect(typeof setOfflineMode).toBe('function');
    expect(typeof isOfflineMode).toBe('function');
  });
});