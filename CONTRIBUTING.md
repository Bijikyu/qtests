# Contributing to qtests

## 🤝 Welcome

Thank you for your interest in contributing to qtests! This guide will help you get started and ensure your contributions can be effectively integrated.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (LTS recommended)
- npm 7+ 
- Git for version control
- Basic knowledge of TypeScript and JavaScript testing

### Development Setup
```bash
# Fork the repository
git clone https://github.com/your-username/qtests.git
cd qtests

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name

# Build the project
npm run build
```

## 🔒 Development Workflow

### 1. Create an Issue
- Check [existing issues](https://github.com/qtests/issues) before starting
- Create a new issue describing your planned changes
- Reference any related issues or discussions

### 2. Fork and Branch
- Fork the repository on GitHub
- Create a descriptive branch name:
  - `feature/your-feature-name`
  - `bugfix/issue-number`
  - `docs/your-docs-update`
  - `security/security-improvement`

### 3. Make Your Changes
- Follow the existing code style and patterns
- Add or update tests for new functionality
- Update documentation for any API changes
- Ensure all security best practices are followed

### 4. Testing
- Run the full test suite: `npm test`
- Add new tests for any new features or bug fixes
- Ensure all tests pass before submitting PR
- Test security considerations if applicable

### 5. Submit a Pull Request
- Push your branch to your fork
- Create a pull request against the `main` branch
- Fill out the PR template completely
- Link to the original issue in your description

## 📝 Code Standards

### Security First
All contributions must follow security best practices:
- [x] No hardcoded secrets or API keys
- [x] Input validation on all user-facing inputs
- [x] Safe command execution with `shell: false`
- [x] Path traversal prevention with validation
- [x] No eval() or Function constructor with dynamic strings
- [x] Environment variable validation and allow-lists
- [x] Dependency vulnerability management

### Code Quality
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure consistent error handling
- Follow existing code formatting patterns

### Testing Requirements
- All new features must include tests
- Bug fixes must include regression tests
- Security improvements must include security tests
- Maintain or improve test coverage
- All tests must pass before PR submission

### Documentation
- Update relevant documentation for API changes
- Add examples for new features
- Update README for breaking changes
- Document security considerations

## 🐛 Bug Reports

### Security Vulnerabilities
- **Please report privately**: For security issues, email security@qtests.dev
- **Public Issues**: Use GitHub security advisories
- **Include Details**: Provide steps to reproduce, expected behavior, and environment details
- **Responsibility**: Priority based on severity and exploitability

### Non-Security Bug Reports
- **Use GitHub Issues**: Create a new issue with appropriate labels
- **Bug Report Template**:
  ```markdown
  ## Bug Description
  ### Expected Behavior
  ### Actual Behavior
  ### Steps to Reproduce
  ### Environment
  ### Possible Solution
  ```

## 📚 Pull Request Guidelines

### PR Template
```markdown
## Description
Brief description of the change

## Type
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Security improvement
- [ ] Performance improvement

## Testing
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Security
- [ ] Security considerations addressed
- [ ] No new vulnerabilities introduced
- [ ] Security tests added

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review of the code completed
- [ ] Documentation updated if needed
- [ ] Breaking changes documented
- [ ] Tests pass locally and in CI
  ```

### Review Process
1. **Self-Review**: Review your own code for security, quality, and functionality
2. **Automated Checks**: Ensure all automated tests pass
3. **Security Review**: Consider security implications of changes
4. **Documentation**: Update relevant docs for any changes

## Merge Requirements
- At least one maintainer approval
- All CI checks passing
- No conflicts with main branch
- Documentation updated if required

## 🔐 Security Contributions

### Security Focus Areas
1. **Input Validation**: Always validate and sanitize user inputs
2. **Command Execution**: Use parameterized commands, never shell concatenation
3. **File Operations**: Validate paths and permissions
4. **Environment Variables**: Use allow-lists, validate all access
5. **Dependencies**: Audit and update dependencies regularly

### Security Review Process
- All security-related PRs require additional review
- Security team approval required for security changes
- Automated security scanning for all PRs

## 📖 Documentation Contributions

### Types of Documentation
- **API Documentation**: Method descriptions, parameters, examples
- **User Guides**: Getting started, tutorials, how-tos
- **Configuration**: Environment variables, CLI options, setup
- **Development**: Contributing guidelines, architecture, design
- **Security**: Security policy, best practices, vulnerability reporting

### Documentation Standards
- Clear and concise language
- Code examples for all public APIs
- Consistent formatting and structure
- Include security considerations where relevant
- Keep documentation in sync with code changes

## 🚀 Getting Help

### Community Support
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Security Issues**: Email security@qtests.dev for sensitive issues

### Resources
- [API Documentation](./docs/api/)
- [Configuration Reference](./docs/configuration/)
- [Security Policy](./SECURITY.md)
- [Architecture Guide](./docs/architecture.md)

---

## 🤝 Thank You!

Your contributions help make qtests better for everyone. We appreciate your time and effort in improving this testing framework!

**Need Help?**
- Check existing [issues](https://github.com/qtests/issues)
- Start a [discussion](https://github.com/qtests/discussions)
- Review our [documentation](./docs/)

Happy contributing! 🎉