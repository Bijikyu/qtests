/**
 * Date/Time Utilities
 * Provides consistent timestamp and date creation patterns
 */

/**
 * Creates a standardized timestamp for current time
 * @returns Current timestamp as Date object
 */
export function createTimestamp(): Date {
  return new Date();
}

/**
 * Creates a standardized ISO string timestamp
 * @returns Current time as ISO string
 */
export function createIsoTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Creates a timestamp string for logging
 * @returns Timestamp string in ISO format
 */
export function createLogTimestamp(): string {
  return createIsoTimestamp();
}

/**
 * Gets current Unix timestamp in milliseconds
 * @returns Current Unix timestamp
 */
export function getCurrentTimeMs(): number {
  return Date.now();
}

/**
 * Creates a future timestamp by adding milliseconds
 * @param msToAdd - Milliseconds to add to current time
 * @returns Future timestamp
 */
export function createFutureTimestamp(msToAdd: number): Date {
  return new Date(Date.now() + msToAdd);
}

/**
 * Creates a timestamp for mock entities with consistent pattern
 * @param offset - Optional time offset in milliseconds (default: 0)
 * @returns Mock timestamp
 */
export function createMockTimestamp(offset: number = 0): Date {
  return new Date(Date.now() + offset);
}