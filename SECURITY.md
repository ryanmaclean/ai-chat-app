# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to security@example.com. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:

- Type of vulnerability
- Full path of the affected file(s)
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

## Security Measures

This project implements several security measures:

1. **Software Bill of Materials (SBOM)**: We maintain a comprehensive SBOM to track all dependencies.
2. **Vulnerability Scanning**: We use OSV-Scanner to detect vulnerabilities in our dependencies.
3. **Dependency Patching**: We apply security patches to vulnerable dependencies.
4. **XML Processing**: We use secure XML processing to prevent XXE attacks.
5. **Content Security Policy**: We implement a strict CSP to prevent XSS attacks.

## Security Best Practices

When contributing to this project, please follow these security best practices:

1. Keep all dependencies up to date
2. Use input validation for all user inputs
3. Avoid using dangerous functions like `eval()` or `innerHTML`
4. Use secure defaults for all configurations
5. Follow the principle of least privilege

## Running Security Scans

To run a security scan locally:

```bash
npm run security:scan
```

To automatically fix security issues:

```bash
npm run security:fix
``` 