/**
 * Type Definitions for Security Test Runner
 * 
 * This module provides TypeScript type definitions for the security test runner
 * script. The actual implementation is in JavaScript, but these definitions
 * enable TypeScript support and IDE autocomplete when importing the module.
 * 
 * Security test runner capabilities:
 * - Comprehensive security validation
 * - Automated vulnerability scanning
 * - Configuration-driven testing
 * - Async test execution with promise support
 * 
 * Integration note:
 * This is a declaration module (.d.ts) that describes the JavaScript
 * implementation in '../../scripts/security-test-runner.js'. The actual
 * security testing logic is implemented in that JavaScript file.
 * 
 * Usage pattern:
 * import { SecurityTestRunner } from '../scripts/security-test-runner.js';
 * const runner = new SecurityTestRunner(config);
 * await runner.runSecurityTests();
 */

declare module '../../scripts/security-test-runner.js' {
  /**
   * Security Test Runner Class
   * 
   * Provides automated security testing capabilities for the qtests framework.
   * Performs comprehensive security validation including vulnerability scanning,
   * dependency analysis, and security best practices verification.
   * 
   * Configuration options are passed as any type to allow
   * flexible security test configuration.
   */
  export class SecurityTestRunner {
    /**
     * Initialize security test runner with configuration
     * 
     * @param config - Security test configuration object
     * Configuration may include:
     * - Test directories and files
     * - Security rules and thresholds
     * - Reporting options
     * - Custom security validators
     */
    constructor(config: any);

    /**
     * Execute comprehensive security tests
     * 
     * Runs the full suite of security tests based on the provided
     * configuration. Tests include:
     * - Static code analysis for security issues
     * - Dependency vulnerability scanning
     * - File permission and access validation
     * - Security best practices verification
     * 
     * @returns Promise that resolves when all security tests complete
     * @throws Error when critical security issues are detected or tests fail
     * 
     * @example
     * const runner = new SecurityTestRunner({
     *   testDirs: ['lib', 'utils'],
     *   strictMode: true
     * });
     * await runner.runSecurityTests();
     * console.log('Security tests completed successfully');
     */
    runSecurityTests(): Promise<void>;
  }
}