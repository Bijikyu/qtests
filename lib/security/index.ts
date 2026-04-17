/**
 * QTests Security Testing Framework - Index
 *
 * Exports security testing utilities: validators for asserting that
 * code correctly rejects dangerous inputs, and penetration testing
 * helpers for verifying injection, XSS, and path-traversal defences.
 */

export {
  SecurityValidator,
  securityValidator,
  validateInput,
  validateJSON,
  validateModuleId,
  validatePath,
  validateCommand,
  type ValidationRule,
  type ValidationResult,
  type SanitizeOptions
} from './SecurityValidator.js';

export {
  JoiSecurityValidator,
  joiSecurityValidator,
  validateInput as validateInputJoi,
  validateJSON as validateJSONJoi,
  validateModuleId as validateModuleIdJoi,
  validatePath as validatePathJoi,
  validateEmail,
  validateURL,
  validateUserInput
} from './JoiSecurityValidator.js';

export {
  PenetrationTester,
  SecurityRegressionTester,
  penetrationTester,
  securityRegressionTester,
  runFullSecurityTest,
  generateSecurityTestReport,
  type SecurityTestCase,
  type SecurityTestResult
} from './SecurityTestingFramework.js';
