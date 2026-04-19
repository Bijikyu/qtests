// @ts-check
import fs from 'fs';
import path from 'path';

/**
 * @typedef {import('../lib/security/types.js').SecurityCategoryInfo} SecurityCategoryInfo
 * @typedef {import('../lib/security/types.js').SecuritySummary} SecuritySummary
 */

/**
 * @typedef {{ type: string, summary: { passed: number, total: number } }} SecurityResult
 * A single category result object returned by the security test runner.
 */

/**
 * Serialize per-category security results to `security-summary.json` in the
 * current working directory.
 *
 * @param {SecurityResult[]} results - Category result objects from the runner.
 * @returns {void}
 */
export function writeSummaryFile(results) {
  const regression = results.find(r => r.type === 'regression_tests');
  const penetration = results.find(r => r.type === 'penetration_tests');
  const configuration = results.find(r => r.type === 'configuration_validation');
  /** @type {SecuritySummary} */
  const summary = {
    regression: regression ? { passed: regression.summary.passed, total: regression.summary.total } : null,
    penetration: penetration ? { passed: penetration.summary.passed, total: penetration.summary.total } : null,
    configuration: configuration ? { passed: configuration.summary.passed, total: configuration.summary.total } : null,
  };
  try {
    fs.writeFileSync(path.resolve(process.cwd(), 'security-summary.json'), JSON.stringify(summary), 'utf8');
  } catch {
    // best-effort: caller continues even if summary file cannot be written
  }
}
