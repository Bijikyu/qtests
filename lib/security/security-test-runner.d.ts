declare module '../../scripts/security-test-runner.js' {
  export class SecurityTestRunner {
    constructor(config: any);
    runSecurityTests(): Promise<void>;
  }
}