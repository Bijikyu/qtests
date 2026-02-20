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

function getJestRef(): any {
  const j = (globalThis as any).jest;
  if (!j) {
    throw new Error('TestMockFactory: Jest global not found (this utility must run inside Jest with injectGlobals enabled)');
  }
  return j;
}

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
    const jestRef = getJestRef();
    jestRef.doMock('../../config/localVars.js', () => config);
  }

  /**
   * Mock Face API module (@vladmandic/face-api)
   * Provides mock implementations for face detection and recognition
   */
  mockFaceApi(): void {
    const jestRef = getJestRef();
    jestRef.doMock('@vladmandic/face-api', () => {
      const mockFaceApi = {
        detectAllFaces: jestRef.fn(() => Promise.resolve([])),
        detectSingleFace: jestRef.fn(() => Promise.resolve(null)),
        createCanvas: jestRef.fn(() => ({})),
        fetchImage: jestRef.fn(() => Promise.resolve({})),
        nets: {
          ssdMobilenetv1: { loadFromUri: jestRef.fn(() => Promise.resolve({})) },
          faceLandmark68Net: { loadFromUri: jestRef.fn(() => Promise.resolve({})) },
          faceRecognitionNet: { loadFromUri: jestRef.fn(() => Promise.resolve({})) }
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
    const jestRef = getJestRef();
    jestRef.doMock('@tensorflow/tfjs-node', () => {
      const mockTensorFlow = {
        node: {
          bindEnvironment: jestRef.fn(),
          enableProdMode: jestRef.fn(),
          disposeVariables: jestRef.fn()
        }
      };

      return mockTensorFlow;
    });
  }

  /**
   * Reset all mocks for clean test environment
   */
  resetMocks(): void {
    const jestRef = getJestRef();
    jestRef.resetModules();
    jestRef.clearAllMocks();
    this.mocksCreated = false;
  }

  /**
   * Get mock Face API instance for test assertions
   * @returns Mock Face API instance
   */
  getMockFaceApi(): any {
    // Use Jest's module registry so this returns the mocked module (not the real dependency).
    const jestRef = getJestRef();
    return (jestRef as any).requireMock ? (jestRef as any).requireMock('@vladmandic/face-api') : undefined;
  }

  /**
   * Get mock TensorFlow instance for test assertions
   * @returns Mock TensorFlow instance
   */
  getMockTensorFlow(): any {
    // Use Jest's module registry so this returns the mocked module (not the real dependency).
    const jestRef = getJestRef();
    return (jestRef as any).requireMock ? (jestRef as any).requireMock('@tensorflow/tfjs-node') : undefined;
  }

  /**
   * Get mock configuration for test assertions
   * @returns Mock configuration instance
   */
  getMockConfig(): any {
    // Use Jest's module registry so this returns the mocked config.
    const jestRef = getJestRef();
    return (jestRef as any).requireMock ? (jestRef as any).requireMock('../../config/localVars.js') : undefined;
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
