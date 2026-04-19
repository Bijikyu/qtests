#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeSummaryFile, SecurityResult } from './writeSummaryFile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RunnerConfig {
  outputPath?: string;
  failOnVulnerabilities?: boolean;
  includePenetrationTests?: boolean;
  generateMetrics?: boolean;
  coverageThreshold?: number;
}

interface TestResult {
  description: string;
  passed: boolean;
  details?: string;
  vulnerabilities: string[];
  recommendations: string[];
}

interface RunnerSummary {
  passed: number;
  total: number;
  failed: number;
  vulnerabilities: number;
}

interface CategoryResult {
  type: SecurityResult['type'];
  timestamp: string;
  results: TestResult[];
  summary: RunnerSummary;
}

interface MetricsResult {
  type: 'security_metrics';
  timestamp: string;
  metrics: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalVulnerabilities: number;
    passRate: string;
    executionTime: number;
  };
  executionTime: number;
}

type RunnerResult = CategoryResult | MetricsResult;

async function resolveSecurityImport(relativeFromScripts: string): Promise<Record<string, unknown>> {
  const distPath = path.resolve(__dirname, relativeFromScripts);
  if (!fs.existsSync(distPath)) {
    throw new Error(`Security module not found. Run 'npm run build' first.\n  Checked: ${distPath}`);
  }
  return import(distPath) as Promise<Record<string, unknown>>;
}

const DEFAULT_CONFIG: Required<RunnerConfig> = {
  outputPath: './security-report.md',
  failOnVulnerabilities: true,
  includePenetrationTests: true,
  generateMetrics: true,
  coverageThreshold: 95,
};

class SecurityTestRunner {
  private config: Required<RunnerConfig>;
  private results: RunnerResult[];
  private startTime: number;

  constructor(config: RunnerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.results = [];
    this.startTime = 0;
  }

  async runSecurityTests(): Promise<void> {
    this.startTime = Date.now();
    console.log('🔒 Starting QTests Security Test Suite');
    console.log(`📊 Configuration: ${JSON.stringify(this.config, null, 2)}`);
    console.log('');
    try {
      await this.runRegressionTests();
      if (this.config.includePenetrationTests) { await this.runPenetrationTests(); }
      await this.validateSecurityConfigurations();
      if (this.config.generateMetrics) { await this.generateSecurityMetrics(); }
      await this.generateSecurityReport();
      this.checkForFailures();
      this.writeSummaryFile();
      console.log('');
      console.log('✅ Security testing completed successfully');
    } catch (error) {
      try {
        const qerrors = await import('qerrors') as { default?: (err: Error, ctx: string, meta: object) => void };
        if (qerrors.default) {
          qerrors.default(
            error instanceof Error ? error : new Error('Security test execution failed'),
            'qtests.security.test_runner',
            { config: this.config, error: String(error), phase: 'main_execution' },
          );
        } else {
          console.error('❌ Security testing failed:', error);
        }
      } catch (importError) {
        console.error('Failed to import qerrors - falling back to console.error');
        console.error('❌ Security testing failed:', error);
        console.error('Import error details:', importError);
      }
      process.exit(1);
    }
  }

  private async runRegressionTests(): Promise<void> {
    console.log('🧪 Running security regression tests...');
    const mod = await resolveSecurityImport('../lib/security/SecurityTestingFramework.js');
    const { runFullSecurityTest } = mod as { runFullSecurityTest: () => TestResult[] };
    const results = runFullSecurityTest();
    this.results.push({
      type: 'regression_tests',
      timestamp: new Date().toISOString(),
      results,
      summary: {
        total: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => r.passed === false).length,
        vulnerabilities: results.reduce((sum, r) => sum + r.vulnerabilities.length, 0),
      },
    });
    console.log(`   ✓ Ran ${results.length} regression tests`);
    console.log(`   ✓ Passed: ${results.filter(r => r.passed).length}`);
    console.log(`   ✓ Failed: ${results.filter(r => r.passed === false).length}`);
  }

  private async runPenetrationTests(): Promise<void> {
    console.log('🎯 Running penetration tests...');
    const mod = await resolveSecurityImport('../lib/security/SecurityTestingFramework.js');
    const { penetrationTester } = mod as {
      penetrationTester: {
        testXSS: (v: string) => TestResult;
        testSQLInjection: (v: string) => TestResult;
        testPathTraversal: (v: string) => TestResult;
        testCommandInjection: (v: string) => TestResult;
      };
    };
    const projectRoot = process.cwd();
    const penetrationResults: TestResult[] = [
      penetrationTester.testXSS('{{payload}}'),
      penetrationTester.testSQLInjection('SELECT * FROM users WHERE id = "{{param}}"'),
      penetrationTester.testPathTraversal(projectRoot + '/{{path}}'),
      penetrationTester.testCommandInjection('ls {{arg}}'),
    ];
    this.results.push({
      type: 'penetration_tests',
      timestamp: new Date().toISOString(),
      results: penetrationResults,
      summary: {
        total: penetrationResults.length,
        passed: penetrationResults.filter(r => r.passed).length,
        failed: penetrationResults.filter(r => r.passed === false).length,
        vulnerabilities: penetrationResults.reduce((sum, r) => sum + r.vulnerabilities.length, 0),
      },
    });
    console.log(`   ✓ Ran ${penetrationResults.length} penetration tests`);
    console.log(`   ✓ Passed: ${penetrationResults.filter(r => r.passed).length}`);
    console.log(`   ✓ Failed: ${penetrationResults.filter(r => r.passed === false).length}`);
  }

  private async validateSecurityConfigurations(): Promise<void> {
    console.log('⚙️ Validating security configurations...');
    const validationResults: TestResult[] = [];
    const mod = await resolveSecurityImport('../lib/security/index.js');
    const { securityValidator } = mod as {
      securityValidator: {
        getRuleSets: () => unknown[];
        validatePath: (p: string) => { valid: boolean };
        validateModuleId: (id: string) => { valid: boolean };
      };
    };
    const ruleSets = securityValidator.getRuleSets();
    validationResults.push({
      description: 'Validation rule sets loaded',
      passed: ruleSets.length > 0,
      details: `Found ${ruleSets.length} rule set(s)`,
      vulnerabilities: [],
      recommendations: ruleSets.length === 0 ? ['Add validation rule sets to SecurityValidator'] : [],
    });
    const pathCheck = securityValidator.validatePath('../../../etc/passwd');
    validationResults.push({
      description: 'Path traversal blocked by validator',
      passed: pathCheck.valid === false,
      details: `Traversal path correctly rejected: ${!pathCheck.valid}`,
      vulnerabilities: pathCheck.valid ? ['Path validator accepted a traversal payload'] : [],
      recommendations: pathCheck.valid ? ['Strengthen path validation logic'] : [],
    });
    const moduleCheck = securityValidator.validateModuleId('safe-module-name');
    validationResults.push({
      description: 'Safe module ID accepted by validator',
      passed: moduleCheck.valid === true,
      details: `Module ID validation result: ${moduleCheck.valid}`,
      vulnerabilities: moduleCheck.valid ? [] : ['Validator rejected a valid module ID'],
      recommendations: moduleCheck.valid ? [] : ['Review module ID validation rules'],
    });
    this.results.push({
      type: 'configuration_validation',
      timestamp: new Date().toISOString(),
      results: validationResults,
      summary: {
        total: validationResults.length,
        passed: validationResults.filter(r => r.passed).length,
        failed: validationResults.filter(r => r.passed === false).length,
        vulnerabilities: validationResults.reduce((sum, r) => sum + (Array.isArray(r.vulnerabilities) ? r.vulnerabilities.length : 0), 0),
      },
    });
    console.log(`   ✓ Validated ${validationResults.length} security configurations`);
    console.log(`   ✓ Passed: ${validationResults.filter(r => r.passed).length}`);
    console.log(`   ✓ Failed: ${validationResults.filter(r => r.passed === false).length}`);
  }

  private async generateSecurityMetrics(): Promise<void> {
    console.log('📈 Generating security metrics...');
    const allResults = this.results;
    const totalTests = allResults.reduce((sum, r) => sum + (('summary' in r && r.summary?.total) || 0), 0);
    const totalPassed = allResults.reduce((sum, r) => sum + (('summary' in r && r.summary?.passed) || 0), 0);
    const totalVulnerabilities = allResults.reduce((sum, r) => sum + (('summary' in r && r.summary?.vulnerabilities) || 0), 0);
    const metrics = {
      totalTests,
      totalPassed,
      totalFailed: totalTests - totalPassed,
      totalVulnerabilities,
      passRate: totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0',
      executionTime: Date.now() - this.startTime,
    };
    this.results.push({
      type: 'security_metrics',
      timestamp: new Date().toISOString(),
      metrics,
      executionTime: Date.now() - this.startTime,
    });
    console.log(`   ✓ Generated security metrics`);
    console.log(`   ✓ Total tests: ${metrics.totalTests}`);
    console.log(`   ✓ Pass rate: ${metrics.passRate}%`);
    console.log(`   ✓ Total vulnerabilities: ${metrics.totalVulnerabilities}`);
  }

  private async generateSecurityReport(): Promise<void> {
    console.log('📝 Generating security report...');
    const reportContent = this.generateReportContent();
    const outputPath = path.resolve(this.config.outputPath || './security-report.md');
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) { fs.mkdirSync(outputDir, { recursive: true }); }
    fs.writeFileSync(outputPath, reportContent, 'utf8');
    console.log(`   ✓ Report saved to: ${outputPath}`);
  }

  private generateReportContent(): string {
    const now = new Date().toISOString();
    const executionTime = Date.now() - this.startTime;
    const totalTests = this.results.reduce((sum, result) => sum + (('results' in result ? result.results?.length : 0) || ('summary' in result ? result.summary?.total : 0) || 0), 0);
    const totalPassed = this.results.reduce((sum, result) => sum + (('summary' in result && result.summary?.passed) || 0), 0);
    const totalFailed = this.results.reduce((sum, result) => sum + (('summary' in result && result.summary?.failed) || 0), 0);
    const totalVulnerabilities = this.results.reduce((sum, result) => sum + (('summary' in result && result.summary?.vulnerabilities) || 0), 0);
    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0';
    const coverageStatus = (parseFloat(successRate) >= (this.config.coverageThreshold || 95)) ? '✅' : '❌';
    const reportPart1 = [
      '# QTests Security Test Report', '',
      `**Generated:** ${now}`,
      `**Execution Time:** ${executionTime}ms`,
      `**Coverage Threshold:** ${this.config.coverageThreshold}%`,
      `**Actual Coverage:** ${successRate}% ${coverageStatus}`,
      '', '## Executive Summary', '',
      `This security test suite ran **${totalTests}** tests with a **${successRate}%** pass rate. `,
      `**${totalVulnerabilities}** vulnerabilities were identified across all test categories.`,
      '', '### Test Results Overview', '',
      '| Category | Total | Passed | Failed | Vulnerabilities |',
      '|----------|-------|--------|--------|----------------|',
    ];
    const tableRows = this.results.map(result => {
      const summary = ('summary' in result ? result.summary : undefined) || {};
      const category = result.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `| ${category} | ${('total' in summary ? summary.total : 0) || 0} | ${('passed' in summary ? summary.passed : 0) || 0} | ${('failed' in summary ? summary.failed : 0) || 0} | ${('vulnerabilities' in summary ? summary.vulnerabilities : 0) || 0} |`;
    });
    const criticalSection = [
      '', '### Critical Issues', '',
      totalVulnerabilities > 0
        ? `❌ **${totalVulnerabilities}** vulnerabilities detected. Immediate attention required.`
        : '✅ No critical vulnerabilities detected.',
    ];
    const detailSection = [
      '', '## Detailed Results', '',
      ...this.results.flatMap(result => this.generateCategorySection(result)),
    ];
    const recommendSection = ['', '## Security Recommendations', '', this.generateRecommendations()];
    const metricsResult = this.results.find(r => r.type === 'security_metrics');
    const metricsData = metricsResult && 'metrics' in metricsResult ? metricsResult.metrics : {};
    const configSection = [
      '', '## Configuration', '',
      '### Test Configuration', '```json', JSON.stringify(this.config, null, 2), '```', '',
      '### Security Metrics', '', '```json', JSON.stringify(metricsData, null, 2), '```',
    ];
    return [
      ...reportPart1, ...tableRows, ...criticalSection,
      ...detailSection, ...recommendSection, ...configSection,
      '', '---', '',
      '*This report was generated automatically by QTests Security Test Runner.*',
    ].join('\n');
  }

  private generateCategorySection(result: RunnerResult): string[] {
    const category = result.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const summary = ('summary' in result ? result.summary : undefined) || {};
    const sections: string[] = [
      `### ${category}`, '',
      `**Timestamp:** ${'timestamp' in result ? result.timestamp : ''}`, '',
      '#### Summary',
      `- Total Tests: ${('total' in summary ? summary.total : 0) || 0}`,
      `- Passed: ${('passed' in summary ? summary.passed : 0) || 0}`,
      `- Failed: ${('failed' in summary ? summary.failed : 0) || 0}`,
      `- Vulnerabilities: ${('vulnerabilities' in summary ? summary.vulnerabilities : 0) || 0}`,
      '',
    ];
    const tests = 'results' in result ? result.results : undefined;
    if (tests && tests.length > 0) {
      sections.push('#### Test Details');
      sections.push('');
      tests.forEach(test => {
        const status = test.passed ? '✅ PASSED' : '❌ FAILED';
        sections.push(`**${test.description}** - ${status}`);
        if (!test.passed) {
          if (test.vulnerabilities.length > 0) {
            sections.push('- Vulnerabilities:');
            test.vulnerabilities.forEach(vuln => { sections.push(`  - ${vuln}`); });
          }
          if (test.recommendations.length > 0) {
            sections.push('- Recommendations:');
            test.recommendations.forEach(rec => { sections.push(`  - ${rec}`); });
          }
        }
        sections.push('');
      });
    }
    return sections;
  }

  private generateRecommendations(): string {
    const allVulnerabilities = new Set<string>();
    this.results.forEach(result => {
      if ('results' in result && result.results) {
        result.results.forEach(test => {
          if (test.vulnerabilities && Array.isArray(test.vulnerabilities)) {
            test.vulnerabilities.forEach(vuln => allVulnerabilities.add(vuln));
          }
        });
      }
    });
    const recommendations: string[] = [];
    if (allVulnerabilities.size > 0) {
      recommendations.push('**Immediate Actions Required:**');
      recommendations.push('');
      recommendations.push('1. Address all identified vulnerabilities before deployment');
      recommendations.push('2. Review and update security configurations');
      recommendations.push('3. Implement additional input validation');
      recommendations.push('4. Strengthen security monitoring and alerting');
      recommendations.push('5. Schedule regular security assessments');
    } else {
      recommendations.push('✅ No immediate security actions required');
    }
    recommendations.push('');
    recommendations.push('**Ongoing Security Practices:**');
    recommendations.push('');
    recommendations.push('- Run security tests in CI/CD pipeline');
    recommendations.push('- Monitor security events continuously');
    recommendations.push('- Keep dependencies updated');
    recommendations.push('- Review security configurations regularly');
    recommendations.push('- Conduct periodic penetration testing');
    return recommendations.join('\n');
  }

  private checkForFailures(): void {
    const totalVulnerabilities = this.results.reduce((sum, result) => sum + (('summary' in result && result.summary?.vulnerabilities) || 0), 0);
    const totalFailed = this.results.reduce((sum, result) => sum + (('summary' in result && result.summary?.failed) || 0), 0);
    const totalPassed = this.results.reduce((sum, result) => sum + (('summary' in result && result.summary?.passed) || 0), 0);
    const totalTests = this.results.reduce((sum, result) => sum + (('summary' in result && result.summary?.total) || 0), 0);
    const successRate = (totalPassed / totalTests) * 100;
    const belowThreshold = successRate < (this.config.coverageThreshold || 95);
    if (this.config.failOnVulnerabilities && (totalVulnerabilities > 0 || totalFailed > 0 || belowThreshold)) {
      console.log('');
      console.log('❌ Security tests failed - exiting with error code');
      console.log(`   - Vulnerabilities: ${totalVulnerabilities}`);
      console.log(`   - Failed Tests: ${totalFailed}`);
      console.log(`   - Coverage: ${successRate.toFixed(1)}% (required: ${this.config.coverageThreshold}%)`);
      process.exit(1);
    }
  }

  writeSummaryFile(): void {
    const securityResults = this.results.filter(
      (r): r is CategoryResult =>
        r.type === 'regression_tests' ||
        r.type === 'penetration_tests' ||
        r.type === 'configuration_validation',
    );
    writeSummaryFile(securityResults);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const config: RunnerConfig = {};
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--output': case '-o': config.outputPath = args[++i]; break;
      case '--no-fail': config.failOnVulnerabilities = false; break;
      case '--penetration': case '-p': config.includePenetrationTests = true; break;
      case '--no-metrics': config.generateMetrics = false; break;
      case '--threshold': case '-t': config.coverageThreshold = parseInt(args[++i]); break;
      case '--help': case '-h':
        console.log(`\nQTests Security Test Runner\n\nUsage: node security-test-runner.js [options]\n\nOptions:\n  -o, --output <path>      Output report file path (default: ./security-report.md)\n  --no-fail               Don't exit with error code on vulnerabilities\n  -p, --penetration        Include penetration tests\n  --no-metrics             Don't generate security metrics\n  -t, --threshold <num>    Security test coverage threshold (default: 95)\n  -h, --help              Show this help message\n\nExamples:\n  node security-test-runner.js\n  node security-test-runner.js --output ./reports/security.md --penetration\n  node security-test-runner.js --threshold 90 --no-fail\n        `);
        process.exit(0);
        break;
      default:
        console.error(`Unknown option: ${args[i]}`);
        console.error('Use --help for available options');
        process.exit(1);
    }
  }
  const runner = new SecurityTestRunner(config);
  await runner.runSecurityTests();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Security test runner failed:', error);
    process.exit(1);
  });
}

export { SecurityTestRunner };
