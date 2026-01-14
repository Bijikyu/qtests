/**
 * Test Mock Factory - Consolidated Mocking Utilities
 * 
 * This factory provides centralized mocking for external dependencies
 * to eliminate duplication across test setup files.
 * 
 * Key Features:
 * - Single source of truth for all test mocks
 * - Consistent mock configuration across test files
 * - Easy to extend with new mock patterns
 * - Memory-efficient test environment setup
 * - Singleton pattern prevents duplicate mock creation
 */

import { jest } from '@jest/globals';

/**
 * Default test configuration for common test scenarios
 */
export const DEFAULT_TEST_CONFIG = {
  PORT: 0,
  SECURITY: {
    REQUIRE_API_KEY: false,
    API_KEY: 'test-integration-api-key-1234567890'
  },
  RATE_LIMITING: {
    ENABLED: false,
    WINDOW_MS: 900000,
    MAX_REQUESTS: 1000
  },
  TENSORFLOW: {
    ENABLE_MODEL_CACHING: false,
    MAX_MODEL_SIZE: 50 * 1024 * 1024,
    CLEANUP_INTERVAL: 30000
  }
};

export type TestConfig = typeof DEFAULT_TEST_CONFIG;

/**
 * Test Mock Factory Class
 * Provides centralized mocking for ML/AI dependencies and configuration
 */
export class TestMockFactory {
  private mocksCreated: boolean = false;

  /**
   * Create all test mocks - call this before importing modules that use mocks
   * @param config - Optional configuration overrides
   */
  createAllMocks(config: Partial<TestConfig> = {}): void {
    if (this.mocksCreated) {
      console.warn('Test mocks already created - skipping duplicate creation');
      return;
    }

    const finalConfig = { ...DEFAULT_TEST_CONFIG, ...config };

    this.mockConfig(finalConfig);
    this.mockFaceApi();
    this.mockTensorFlow();

    this.mocksCreated = true;
  }

  /**
   * Mock configuration module
   * @param config - Configuration object to use as mock
   */
  mockConfig(config: TestConfig): void {
    jest.doMock('../../config/localVars.js', () => config);
  }

  /**
   * Mock Face API module (@vladmandic/face-api)
   * Provides mock implementations for face detection and recognition
   */
  mockFaceApi(): void {
    jest.doMock('@vladmandic/face-api', () => {
      const mockFaceApi = {
        detectAllFaces: jest.fn(() => Promise.resolve([])),
        detectSingleFace: jest.fn(() => Promise.resolve(null)),
        createCanvas: jest.fn(() => ({})),
        fetchImage: jest.fn(() => Promise.resolve({})),
        nets: {
          ssdMobilenetv1: { loadFromUri: jest.fn(() => Promise.resolve({})) },
          faceLandmark68Net: { loadFromUri: jest.fn(() => Promise.resolve({})) },
          faceRecognitionNet: { loadFromUri: jest.fn(() => Promise.resolve({})) }
        }
      };

      return mockFaceApi;
    });
  }

  /**
   * Mock TensorFlow module (@tensorflow/tfjs-node)
   * Provides mock implementations for TensorFlow operations
   */
  mockTensorFlow(): void {
    jest.doMock('@tensorflow/tfjs-node', () => {
      const mockTensorFlow = {
        node: {
          bindEnvironment: jest.fn(),
          enableProdMode: jest.fn(),
          disposeVariables: jest.fn()
        }
      };

      return mockTensorFlow;
    });
  }

  /**
   * Reset all mocks for clean test environment
   */
  resetMocks(): void {
    jest.resetModules();
    jest.clearAllMocks();
    this.mocksCreated = false;
  }

  /**
   * Get mock Face API instance for test assertions
   * @returns Mock Face API instance
   */
  getMockFaceApi(): any {
    return require('@vladmandic/face-api');
  }

  /**
   * Get mock TensorFlow instance for test assertions
   * @returns Mock TensorFlow instance
   */
  getMockTensorFlow(): any {
    return require('@tensorflow/tfjs-node');
  }

  /**
   * Get mock configuration for test assertions
   * @returns Mock configuration instance
   */
  getMockConfig(): any {
    return require('../../config/localVars.js');
  }

  /**
   * Check if mocks have been created
   * @returns True if mocks are already created
   */
  isMocksCreated(): boolean {
    return this.mocksCreated;
  }
}

/**
 * Singleton factory instance for consistent mock state
 */
export const factory = new TestMockFactory();

/**
 * Convenience function for creating test mocks
 * @param config - Optional configuration overrides
 * @returns Test mock factory instance
 */
export function createTestMocks(config?: Partial<TestConfig>): TestMockFactory {
  factory.createAllMocks(config);
  return factory;
}

/**
 * Quick setup function for most common use case
 * @param config - Optional configuration overrides
 */
export function setupTestEnvironment(config?: Partial<TestConfig>): void {
  createTestMocks(config);
}
