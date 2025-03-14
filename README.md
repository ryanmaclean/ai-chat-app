# (DEMO!) AI Chat App

A modern React application for interacting with AI models through the OpenAI API, featuring a glassomorphic UI design.

## Features

- Sleek glassomorphic interface
- Real-time chat with AI models
- Syntax highlighting for code blocks
- Markdown rendering for responses
- Adjustable temperature and model selection
- Responsive design for all devices

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` and add your OpenAI API key.

3. Run the development server:
   ```
   npm run dev
   ```

4. For production build:
   ```
   npm run build
   npm run preview
   ```

## Tech Stack

- React 18
- Vite 6.2.1
- TailwindCSS
- OpenAI API
- Glassomorphic UI design

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```
# API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_API_URL=http://localhost:3000

# Datadog Configuration (Optional)
VITE_DATADOG_SITE=datadoghq.com
VITE_DATADOG_API_KEY=your_datadog_api_key
VITE_DATADOG_APP_ID=your_datadog_app_id
VITE_DATADOG_CLIENT_TOKEN=your_datadog_client_token
VITE_DATADOG_SBOM_ENABLED=true
VITE_DATADOG_SBOM_PROJECT_NAME=ai-chat-app
```

## Security

This project takes security seriously. We use the following tools and practices:

### SBOM Management

We generate and maintain a Software Bill of Materials (SBOM) using Datadog SCA:

```
npm run sbom:generate
```

### Vulnerability Scanning

We use Datadog's Security Code Analysis (SCA) to detect vulnerabilities:

```
npm run security:scan
```

### Security Fixes

To automatically fix security issues:

```
npm run security:fix
```

### Advanced Security Audit

Run a comprehensive security audit and fix:

```
npm run audit:fix
```

This will:
- Replace vulnerable dependencies with secure alternatives
- Apply security patches
- Clean the package lock file
- Run a final security audit

### Reporting Security Issues

Please see our [Security Policy](SECURITY.md) for information on reporting security vulnerabilities.

## Build System

This project uses Vite 6.2.1, which provides:

- Extremely fast development server with HMR
- Optimized production builds
- Built-in security features
- Modern browser targeting
- Efficient code splitting

To customize the build configuration, see `vite.config.js`.

## Troubleshooting

### Missing Dependencies

If you encounter errors about missing dependencies, run:

```
node scripts/install-missing-deps.js
```

This will install all required dependencies and create necessary patches.

### Vite Version Issues

If you encounter issues with Vite version compatibility, run:

```
node scripts/fix-vite-version.js
```

This will install the correct version of Vite and remove any unnecessary patches.
