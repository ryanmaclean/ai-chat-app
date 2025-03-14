import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env file
const envFile = path.resolve('.env')
const env = fs.existsSync(envFile)
  ? Object.fromEntries(
      fs.readFileSync(envFile, 'utf8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('=').map(part => part.trim()))
    )
  : {}

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    cors: true,
    headers: {
      'Content-Security-Policy': 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "font-src 'self' data:; " +
        "img-src 'self' data: blob:; " +
        "connect-src 'self' http://localhost:* https://api.openai.com; " +
        "frame-ancestors 'none';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'no-referrer'
    }
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'esnext',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          markdown: ['react-markdown'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-switch', '@radix-ui/react-dialog'],
          datadog: ['@datadog/browser-rum', '@datadog/browser-logs']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-markdown',
      'shiki',
      'copy-to-clipboard',
      '@radix-ui/react-tabs',
      '@radix-ui/react-switch',
      '@radix-ui/react-dialog',
      'recharts'
    ]
  },
  security: {
    csp: {
      policy: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:'],
        'connect-src': ["'self'", 'https://api.openai.com', 'https://api.datadoghq.com', 'https://api.datadoghq.eu'],
        'font-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"]
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY || ''),
    'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:3000'),
    'process.env.VITE_DATADOG_SITE': JSON.stringify(env.VITE_DATADOG_SITE || 'datadoghq.com'),
    'process.env.VITE_DATADOG_API_KEY': JSON.stringify(env.VITE_DATADOG_API_KEY || ''),
    'process.env.VITE_DATADOG_APP_ID': JSON.stringify(env.VITE_DATADOG_APP_ID || ''),
    'process.env.VITE_DATADOG_CLIENT_TOKEN': JSON.stringify(env.VITE_DATADOG_CLIENT_TOKEN || ''),
    'process.env.VITE_DATADOG_SBOM_ENABLED': JSON.stringify(env.VITE_DATADOG_SBOM_ENABLED || 'false'),
    'process.env.VITE_DATADOG_SBOM_PROJECT_NAME': JSON.stringify(env.VITE_DATADOG_SBOM_PROJECT_NAME || 'ai-chat-app')
  }
})
