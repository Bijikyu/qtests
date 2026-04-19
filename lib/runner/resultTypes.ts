/**
 * Type definitions for the structured results file written after every qtests run.
 *
 * `qtests-results.json` is written by `bin/qtests-ts-runner` at the end of
 * each run. The `schemaVersion` field allows future consumers to detect format
 * changes without breaking.
 */

import type { SecuritySummary } from '../security/types.js';

export type { SecuritySummary };

/**
 * Result record for a single test file.
 */
export interface FileResult {
  /** Absolute or relative path to the test file. */
  path: string;
  /** Whether all tests in this file passed. */
  success: boolean;
  /** Execution time in milliseconds. */
  durationMs: number;
  /** Failure output if the file did not pass; empty string otherwise. */
  failureMessage: string;
}

/**
 * Top-level schema for `qtests-results.json`.
 */
export interface RunResult {
  /**
   * Monotonically increasing integer. Bump when a breaking change is made to
   * this schema so downstream consumers can detect it.
   */
  schemaVersion: 1;
  /** ISO-8601 timestamp recorded at the start of the run. */
  timestamp: string;
  /** Wall-clock duration of the entire run in milliseconds. */
  totalDurationMs: number;
  /** Number of test files where every test passed. */
  passedFiles: number;
  /** Number of test files that contained at least one failing test. */
  failedFiles: number;
  /** Per-file breakdown. */
  files: FileResult[];
  /**
   * Security summary read from `security-summary.json` if a security run
   * occurred during this invocation; `null` otherwise.
   */
  securitySummary: SecuritySummary | null;
}
