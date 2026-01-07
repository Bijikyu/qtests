/**
 * Data and Database Testing Utilities
 * 
 * This module provides utilities for database mocking, model simulation,
 * and data generation for testing scenarios. These utilities help test
 * data-dependent applications without requiring actual database connections.
 * 
 * Design philosophy:
 * - Database-free testing for fast, isolated tests
 * - Realistic data generation for comprehensive testing
 * - In-memory model simulation with full API compatibility
 * - Email system mocking for notification testing
 * 
 * Why data utilities are grouped together:
 * 1. All utilities deal with data persistence and generation
 * 2. They provide alternatives to external data dependencies
 * 3. Often used together in application testing scenarios
 * 4. Share common patterns for entity creation and management
 * 
 * Module organization rationale:
 * These utilities are grouped because they all serve the purpose of
 * providing data and persistence layer testing without external dependencies,
 * offering different levels of abstraction for various testing needs.
 */

// Import mockModels for in-memory database model simulation
// mockModels provides Mongoose-compatible models without database dependencies
// for testing data-dependent applications with full CRUD operations
import mockModels from '../utils/mockModels.js';

// Import sendEmail utility for email system mocking
// sendEmail provides lightweight email mocking for testing notification systems
// without requiring external mail service configuration or actual email delivery
import { sendEmail } from '../utils/sendEmail.js';

/**
 * Export data and database testing utilities
 * 
 * These utilities are exported together because they provide
 * complementary functionality for data layer testing:
 * 
 * - mockModels: For database model simulation and CRUD operations
 * - sendEmail: For email system mocking and notification testing
 * 
 * Export strategy:
 * - Named exports for ES module compatibility
 * - Descriptive property names that indicate purpose
 * - Grouped by data-related functionality for developer convenience
 */
export {
  // In-memory database model simulation with Mongoose compatibility
  mockModels,
  
  // Email system mocking for notification testing
  sendEmail
};