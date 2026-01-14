# Enterprise Integration Guide

This guide covers enterprise-level integration patterns, best practices, and operational considerations for using qtests in production environments.

## 🏢 Enterprise Setup

### Repository Structure

```
monorepo/
├── packages/
│   ├── frontend/          # React/Next.js application
│   ├── backend-api/        # Node.js API service
│   ├── shared-types/      # TypeScript type definitions
│   └── test-utils/        # Shared testing utilities
├── tests/
│   ├── integration/        # Cross-package integration tests
│   ├── e2e/             # End-to-end tests
│   ├── performance/        # Performance benchmarks
│   └── fixtures/          # Test data and mock servers
├── pipelines/             # CI/CD configurations
└── infrastructure/       # Docker, Terraform, etc.
```

### Package.json Configuration

```json
{
  "name": "enterprise-app",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "test:unit": "jest --testPathPattern=packages/*/src/**/*.test.ts",
    "test:integration": "jest --config=tests/integration/jest.config.mjs",
    "test:e2e": "jest --config=tests/e2e/jest.config.mjs",
    "test:performance": "node tests/performance/run-benchmarks.js",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "test:coverage": "jest --coverage --collectCoverageFrom=\"packages/*/src/**/*.{ts,tsx}\"",
    "test:ci": "CI=true npm run test:all",
    "test:watch": "jest --watch --testPathPattern=packages/*/src"
  },
  "devDependencies": {
    "@bijikyu/qtests": "^2.0.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.4.1",
    "@types/jest": "^30.0.0"
  }
}
```

## 🔄 CI/CD Integration

### GitHub Actions Enterprise Workflow

```yaml
# .github/workflows/enterprise-tests.yml
name: Enterprise Test Suite

on:
  push:
    branches: [main, develop, release/*]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  CACHE_VERSION: v1

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      cache-key: ${{ steps.cache-key.outputs.key }}
    steps:
      - uses: actions/checkout@v3
      - name: Generate cache key
        id: cache-key
        run: |
          echo "key=${CACHE_VERSION}-node-${NODE_VERSION}-$(hash package-lock.json)" >> $GITHUB_OUTPUT

  test-unit:
    needs: setup
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate tests
        run: npx qtests-generate --src packages --integration --force
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unit-tests
          name: unit-test-coverage

  test-integration:
    needs: setup
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Wait for services
        run: |
          timeout 60 bash -c 'until nc -z localhost 5432; do sleep 1; done'
          timeout 60 bash -c 'until nc -z localhost 6379; do sleep 1; done'
      
      - name: Run database migrations
        run: npm run migrate:test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
      
      - name: Upload integration coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./tests/integration/coverage/lcov.info
          flags: integration-tests
          name: integration-test-coverage

  test-performance:
    needs: test-unit
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run performance benchmarks
        run: npm run test:performance
      
      - name: Upload performance results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: tests/performance/results/

  security-scan:
    needs: test-unit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run security audit
        run: npm audit --audit-level=moderate
      
      - name: Run SAST scan
        uses: github/super-linter@v4
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VALIDATE_TYPESCRIPT_ES: true
          VALIDATE_JAVASCRIPT_ES: true

  deploy-staging:
    needs: [test-unit, test-integration]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment..."
          # Add your deployment commands here
```

### Jenkins Declarative Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'your-registry.com'
        APP_NAME = 'enterprise-app'
    }

    stages {
        stage('Setup') {
            parallel {
                stage('Node.js') {
                    steps {
                        sh 'nvm install ${NODE_VERSION}'
                        sh 'nvm use ${NODE_VERSION}'
                    }
                }
                stage('Dependencies') {
                    steps {
                        sh 'npm ci --prefer-offline --no-audit'
                    }
                }
            }
        }

        stage('Test Generation') {
            steps {
                sh 'npx qtests-generate --src packages --integration --force'
            }
        }

        stage('Testing') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh '''
                            npm run test:unit -- --coverage --ci
                            npm run test:coverage -- --ci
                        '''
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'coverage',
                            reportFiles: 'index.html',
                            reportName: 'Unit Test Coverage Report'
                        ])
                    }
                }

                stage('Integration Tests') {
                    steps {
                        script {
                            // Start test dependencies
                            sh 'docker-compose -f docker-compose.test.yml up -d'
                            try {
                                sh 'npm run test:integration -- --ci'
                            } finally {
                                sh 'docker-compose -f docker-compose.test.yml down'
                            }
                        }
                    }
                }

                stage('Performance Tests') {
                    when {
                        anyOf {
                            branch 'main'
                            changeRequest()
                        }
                    }
                    steps {
                        sh 'npm run test:performance'
                        archiveArtifacts artifacts: 'tests/performance/results/*', fingerprint: true
                    }
                }
            }
        }

        stage('Security') {
            parallel {
                stage('Dependency Audit') {
                    steps {
                        sh 'npm audit --audit-level=moderate --json > audit-report.json'
                        archiveArtifacts artifacts: 'audit-report.json'
                    }
                }

                stage('SAST Scan') {
                    steps {
                        sh '''
                            npm install -g sonar-scanner
                            sonar-scanner \
                                -Dsonar.projectKey=${APP_NAME} \
                                -Dsonar.sources=. \
                                -Dsonar.host.url=${SONAR_URL} \
                                -Dsonar.login=${SONAR_TOKEN}
                        '''
                    }
                }
            }
        }

        stage('Build') {
            when {
                branch pattern: 'main|develop|release/*', comparator: 'REGEXP'
            }
            steps {
                sh 'npm run build'
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }

        stage('Deploy') {
            when {
                branch pattern: 'main|develop', comparator: 'REGEXP'
            }
            parallel {
                stage('Staging') {
                    when {
                        branch 'develop'
                    }
                    steps {
                        script {
                            deployEnvironment('staging')
                        }
                    }
                }

                stage('Production') {
                    when {
                        branch 'main'
                    }
                    input {
                        message "Deploy to production?"
                        ok "Deploy"
                    }
                    steps {
                        script {
                            deployEnvironment('production')
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Generate test report
                sh '''
                    npm run test:ci-report || true
                    node scripts/generate-jenkins-summary.js
                '''
                
                // Notify Slack
                if (currentBuild.result == 'SUCCESS') {
                    slackSend(
                        channel: '#deployments',
                        color: 'good',
                        message: "✅ ${APP_NAME} deployed successfully to ${env.ENVIRONMENT}"
                    )
                } else {
                    slackSend(
                        channel: '#alerts',
                        color: 'danger',
                        message: "❌ ${APP_NAME} deployment failed in ${env.ENVIRONMENT}"
                    )
                }
            }
        }
    }
}

def deployEnvironment(environment) {
    sh """
        echo "Deploying to ${environment}..."
        docker build -t ${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER} .
        docker push ${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}
        
        # Update deployment
        kubectl set image deployment/${APP_NAME} ${APP_NAME}=${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER} -n ${environment}
        kubectl rollout status deployment/${APP_NAME} -n ${environment}
    """
}
```

## 🔧 Configuration Management

### Environment-Specific Test Configurations

```typescript
// tests/configs/test-configs.ts
export const testConfigs = {
  unit: {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/packages/*/src/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup/unit.ts'],
    collectCoverageFrom: [
      'packages/*/src/**/*.{ts,tsx}',
      '!packages/*/src/**/*.d.ts'
    ],
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  },

  integration: {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup/integration.ts'],
    testTimeout: 30000,
    maxWorkers: 4 // Limit concurrent database connections
  },

  e2e: {
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/tests/e2e/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup/e2e.ts'],
    testTimeout: 60000, // 1 minute timeout for e2e tests
    maxWorkers: 1 // Run e2e tests serially
  },

  performance: {
    testMatch: ['<rootDir>/tests/performance/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup/performance.ts'],
    testTimeout: 120000, // 2 minutes for performance tests
    maxWorkers: 1
  }
};

export const getConfig = (type: keyof typeof testConfigs) => {
  const baseConfig = {
    preset: 'ts-jest',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
      '^@shared/(.*)$': '<rootDir>/packages/shared-types/src/$1',
      '^@utils/(.*)$': '<rootDir>/packages/test-utils/src/$1'
    },
    collectCoverage: process.env.CI === 'true'
  };

  return { ...baseConfig, ...testConfigs[type] };
};
```

### Docker Test Environment

```dockerfile
# Dockerfile.test
FROM node:18-alpine

WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=node:node . .

# Install qtests for test generation
RUN npm install -g qtests

# Create test directories
RUN mkdir -p tests/{unit,integration,e2e,performance}

# Set permissions
RUN chown -R node:node /app

USER node

CMD ["npm", "test:ci"]
```

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      NODE_ENV: test
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/test_db
      REDIS_URL: redis://redis:6379
      JWT_SECRET: test-secret
    volumes:
      - ./coverage:/app/coverage
      - ./test-results:/app/test-results
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: test_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - postgres_test_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  test-runner:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      QTESTS_CONCURRENCY: 2
      QTESTS_INBAND: true
      CI: true
    command: npm run test:integration
    volumes:
      - ./test-results:/app/test-results

volumes:
  postgres_test_data:
```

## 📊 Monitoring and Observability

### Test Performance Monitoring

```typescript
// tests/monitoring/performance-monitor.ts
import { createHistogram, createCounter } from 'prom-client';

export const testMetrics = {
  testDuration: createHistogram({
    name: 'test_execution_duration_seconds',
    help: 'Test execution duration in seconds',
    labelNames: ['test_type', 'test_suite']
  }),

  testCount: createCounter({
    name: 'test_executions_total',
    help: 'Total number of test executions',
    labelNames: ['test_type', 'status']
  }),

  testFailures: createCounter({
    name: 'test_failures_total',
    help: 'Total number of test failures',
    labelNames: ['test_type', 'error_type']
  }),

  testCoverage: createHistogram({
    name: 'test_coverage_percent',
    help: 'Test coverage percentage',
    labelNames: ['type'] // lines, branches, functions, statements
  })
};

export const recordTestMetric = (testType: string, suite: string, duration: number, status: string) => {
  testMetrics.testDuration.labels({ test_type: testType, test_suite: suite }).observe(duration);
  testMetrics.testCount.labels({ test_type: testType, status }).inc();
  
  if (status === 'failed') {
    testMetrics.testFailures.labels({ test_type: testType, error_type: 'generic' }).inc();
  }
};
```

### Health Check Integration

```typescript
// tests/monitoring/health-checks.ts
import { addHealthMonitoring } from '@bijikyu/qtests/lib/connectionPoolHealth.js';

export class TestHealthMonitor {
  private monitors = new Map();

  addDatabaseMonitor(name: string, pool: any) {
    const monitor = addHealthMonitoring(pool, {
      healthCheckInterval: 30000,
      unhealthyConnectionThreshold: 3,
      enableDetailedLogging: process.env.NODE_ENV !== 'production'
    });

    monitor.on('health-check-completed', (status) => {
      this.emitHealthMetric('database_health', {
        name,
        healthy_connections: status.healthyConnections,
        total_connections: status.totalConnections,
        avg_response_time: status.averageResponseTime
      });
    });

    this.monitors.set(name, monitor);
    return monitor;
  }

  addServiceMonitor(name: string, circuitBreaker: any) {
    circuitBreaker.on('open', () => {
      this.emitHealthMetric('circuit_breaker_state', {
        name,
        state: 'open'
      });
    });

    circuitBreaker.on('close', () => {
      this.emitHealthMetric('circuit_breaker_state', {
        name,
        state: 'closed'
      });
    });
  }

  private emitHealthMetric(metric: string, labels: Record<string, any>) {
    // Send to monitoring system
    if (process.env.PROMETHEUS_ENABLED) {
      // Prometheus metrics
    } else if (process.env.DATADOG_API_KEY) {
      // Datadog metrics
    } else {
      console.log(`Health Metric: ${metric}`, labels);
    }
  }

  async shutdown() {
    for (const [name, monitor] of this.monitors) {
      await monitor.shutdown(true);
    }
  }
}
```

## 🚀 Deployment Strategies

### Blue-Green Testing

```typescript
// scripts/deploy/blue-green-deploy.ts
import { execSync } from 'child_process';
import { testEnvironment } from '../utils/environment-tester.js';

class BlueGreenDeployer {
  private appName: string;
  private environment: string;

  constructor(appName: string, environment: string) {
    this.appName = appName;
    this.environment = environment;
  }

  async deploy(): Promise<void> {
    const blueEnvironment = `${this.environment}-blue`;
    const greenEnvironment = `${this.environment}-green`;

    try {
      // Deploy to green environment
      await this.deployToEnvironment(greenEnvironment);
      
      // Run comprehensive tests
      await this.testEnvironment(greenEnvironment);
      
      // Switch traffic to green
      await this.switchTraffic(greenEnvironment);
      
      // Clean up blue environment
      await this.cleanupEnvironment(blueEnvironment);
      
      console.log(`✅ Successfully deployed to ${this.environment}`);
    } catch (error) {
      console.error(`❌ Deployment failed: ${error.message}`);
      await this.rollback();
      throw error;
    }
  }

  private async deployToEnvironment(targetEnv: string): Promise<void> {
    console.log(`📦 Deploying to ${targetEnv}...`);
    
    execSync(`kubectl apply -f k8s/${targetEnv}/ -n ${targetEnv}`, { stdio: 'inherit' });
    execSync(`kubectl rollout status deployment/${this.appName} -n ${targetEnv}`, { stdio: 'inherit' });
  }

  private async testEnvironment(targetEnv: string): Promise<void> {
    console.log(`🧪 Testing ${targetEnv}...`);
    
    const testResults = await testEnvironment(targetEnv, {
      healthCheck: {
        endpoint: `https://${targetEnv}.company.com/health`,
        timeout: 30000,
        retries: 3
      },
      smokeTests: {
        endpoint: `https://${targetEnv}.company.com/api/smoke`,
        tests: ['user-login', 'data-fetch', 'basic-operations']
      },
      performanceTests: {
        duration: 60000, // 1 minute
        threshold: {
          responseTime: 500, // 500ms
          errorRate: 0.01 // 1%
        }
      }
    });

    if (!testResults.allPassed) {
      throw new Error(`Tests failed: ${testResults.failures.join(', ')}`);
    }
  }

  private async switchTraffic(targetEnv: string): Promise<void> {
    console.log(`🔄 Switching traffic to ${targetEnv}...`);
    
    execSync(`
      kubectl patch service ${this.appName} -n ${this.environment} \\
      -p '{"spec":{"selector":{"version":"${targetEnv}"}}}'
    `, { stdio: 'inherit' });
  }

  private async cleanupEnvironment(env: string): Promise<void> {
    console.log(`🧹 Cleaning up ${env}...`);
    
    try {
      execSync(`kubectl delete -f k8s/${env}/ -n ${env} --ignore-not-found`, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`Cleanup warning: ${error.message}`);
    }
  }

  private async rollback(): Promise<void> {
    console.log(`🔙 Rolling back deployment...`);
    
    // Implement rollback logic
    await this.switchTraffic(`${this.environment}-blue`);
  }
}

// CLI usage
const deployer = new BlueGreenDeployer('enterprise-app', 'production');
deployer.deploy().catch(console.error);
```

## 🔒 Security Integration

### Security Testing Pipeline

```typescript
// tests/security/security-test-suite.ts
import { runTestSuite } from '@bijikyu/qtests';
import { testSecurityVulnerabilities } from '../utils/security-scanner.js';

export const securityTestSuite = {
  'dependency-vulnerability-scan': async () => {
    const auditResults = await exec('npm audit --json');
    const vulnerabilities = JSON.parse(auditResults).vulnerabilities;
    
    if (vulnerabilities.high > 0 || vulnerabilities.critical > 0) {
      throw new Error(`High/Critical vulnerabilities found: ${vulnerabilities.high} high, ${vulnerabilities.critical} critical`);
    }
    
    console.log(`✅ Security audit passed: ${vulnerabilities.low} low, ${vulnerabilities.moderate} moderate issues`);
  },

  'code-security-scan': async () => {
    const securityIssues = await testSecurityVulnerabilities('./src');
    
    if (securityIssues.length > 0) {
      console.warn('🔒 Security issues found:', securityIssues);
      // In CI, you might want to fail the build
      if (process.env.CI === 'true' && securityIssues.some(issue => issue.severity === 'high')) {
        throw new Error('High-severity security issues detected');
      }
    }
  },

  'api-security-tests': async () => {
    const apiSecurityTests = [
      {
        name: 'sql-injection-protection',
        test: async () => {
          const maliciousInput = "'; DROP TABLE users; --";
          const response = await apiClient.post('/api/users', { email: maliciousInput });
          
          if (response.status === 200) {
            throw new Error('SQL injection vulnerability detected');
          }
        }
      },
      {
        name: 'xss-protection',
        test: async () => {
          const xssPayload = '<script>alert("xss")</script>';
          const response = await apiClient.post('/api/comments', { content: xssPayload });
          
          if (response.data?.content?.includes('<script>')) {
            throw new Error('XSS vulnerability detected');
          }
        }
      }
    ];

    for (const test of apiSecurityTests) {
      try {
        await test.test();
        console.log(`✅ ${test.name} passed`);
      } catch (error) {
        console.error(`❌ ${test.name} failed: ${error.message}`);
        throw error;
      }
    }
  }
};

// Run security tests
if (require.main === module) {
  runTestSuite('Security Tests', securityTestSuite);
}
```

## 📈 Best Practices for Enterprise

### 1. Test Organization
- **Separate concerns**: Unit, integration, e2e, and performance tests in separate directories
- **Environment parity**: Test environments should mirror production as closely as possible
- **Data management**: Use fixtures and factories for test data, avoid hardcoded values

### 2. Performance Considerations
- **Parallel execution**: Configure appropriate worker counts for different test types
- **Resource management**: Limit database connections in integration tests
- **Caching**: Leverage Docker layer caching and dependency caching in CI

### 3. Security Integration
- **Automated scanning**: Include dependency and code security scans in pipeline
- **Secret management**: Never commit secrets; use environment variables or secret managers
- **Vulnerability testing**: Regularly test for common vulnerabilities (SQLi, XSS, etc.)

### 4. Monitoring and Alerting
- **Test metrics**: Track test execution times, pass rates, and coverage trends
- **Health monitoring**: Monitor test environments and external dependencies
- **Alerting**: Set up appropriate alerts for test failures and performance regressions

### 5. Deployment Safety
- **Gradual rollouts**: Use blue-green or canary deployments
- **Automated rollback**: Always have rollback strategies in place
- **Feature flags**: Use feature flags to control new functionality releases

## 🎯 Success Metrics

### Key Performance Indicators
- **Test coverage**: Target >80% for new code, maintain existing coverage
- **Test execution time**: Unit tests <5min, integration tests <15min
- **Flakiness rate**: <1% of tests should be flaky
- **CI pipeline time**: Total pipeline <30 minutes for typical changes

### Quality Gates
- **No high/critical security vulnerabilities** in production deployments
- **All performance benchmarks passing** before major releases
- **Documentation coverage**: All public APIs documented
- **Regression testing**: All critical paths tested before releases

This enterprise integration guide provides a comprehensive foundation for implementing qtests in large-scale, production environments with proper CI/CD integration, monitoring, and security considerations.