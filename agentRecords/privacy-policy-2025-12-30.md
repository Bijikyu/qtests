# Privacy Policy - qtests Framework

**Effective Date:** December 30, 2025  
**Last Updated:** December 30, 2025

## Overview

The qtests framework is a Node.js testing utility designed for unit testing applications that depend on external services. This privacy policy outlines how we handle data in our open-source testing framework.

## Data Collection and Usage

### What We Don't Collect
- **No Personal Information**: The qtests framework does not collect, store, or process any personal identifiable information (PII)
- **No Usage Analytics**: We do not track how you use the framework or collect analytics data
- **No User Profiling**: No user profiles or behavioral tracking is performed

### What We Do Process
- **Test Data**: The framework processes test data that you provide during test execution
- **Error Logs**: Error information may be logged locally for debugging purposes
- **Configuration Data**: Environment variables and configuration settings used for test execution

## Data Storage and Security

### Local Processing Only
- All test execution and data processing occurs locally on your development machine
- No data is transmitted to external servers by the qtests framework itself
- Test data, logs, and configurations are stored only in your local project directory

### Security Measures
- **No Network Calls**: The core framework is designed to stub external service calls during testing
- **Encrypted Storage**: Sensitive configuration data should be stored using environment variables
- **Access Control**: Local file permissions control access to test data and configurations

## Third-Party Services

### External Dependencies
The qtests framework may use third-party npm packages for:
- Test running (Jest, Mocha, etc.)
- Node.js module resolution
- File system operations

### User-Configured External Services
When you configure external services (API keys, tokens):
- These are used only during your test execution
- Configuration should follow your organization's security policies
- qtests does not transmit these credentials to any external service

## Your Rights

Since qtests does not collect personal data:
- **No Data Subject Rights**: GDPR/CCPA rights do not apply as no personal data is processed
- **Local Data Control**: You maintain full control over all test data and configurations stored locally
- **Transparency**: This policy fully discloses all data processing activities

## Data Retention

- **Test Results**: Retained according to your local configuration and development practices
- **Logs**: Stored locally until manually cleared by the developer
- **Configuration**: Retained as part of your project configuration until changed

## Security Best Practices

We recommend the following for secure usage:

1. **Environment Variables**: Store sensitive data (API keys, tokens) in environment variables
2. **Git Security**: Ensure `.env` files and sensitive configurations are excluded from version control
3. **Local Testing**: Use qtests for unit testing where external services are stubbed
4. **Access Control**: Implement appropriate file permissions for test directories

## Compliance

### Regulatory Compliance
- **GDPR**: Compliant - no personal data processing
- **CCPA**: Compliant - no personal data collection
- **Industry Standards**: Follows OWASP security guidelines for development tools

### Security Standards
- **OWASP Top 10**: Addresses relevant vulnerabilities for development tools
- **Secure Coding**: Follows security best practices in Node.js development
- **Dependency Management**: Regularly updates dependencies for security patches

## Changes to This Policy

We may update this privacy policy when:
- New features are added that affect data processing
- Security practices are enhanced
- Regulatory requirements change

Changes will be:
- Documented in the project changelog
- Reflected in the version history
- Announced in release notes

## Contact Information

For questions about this privacy policy or security practices:

**Project Repository:** https://github.com/qtests/qtests  
**Issues:** https://github.com/qtests/qtests/issues  
**Security:** Report security issues privately via GitHub's security advisory features

---

**Note:** This privacy policy applies to the qtests framework itself. Applications using qtests may have separate privacy policies for their own data handling practices.