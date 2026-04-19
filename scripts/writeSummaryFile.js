import fs from 'fs';
import path from 'path';

export function writeSummaryFile(results) {
  const regression = results.find(r => r.type === 'regression_tests');
  const penetration = results.find(r => r.type === 'penetration_tests');
  const configuration = results.find(r => r.type === 'configuration_validation');
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
