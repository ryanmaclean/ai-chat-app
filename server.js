import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import { setupCSP } from './server-middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  
  // Parse JSON request bodies
  app.use(express.json());
  
  // Setup Content Security Policy
  setupCSP(app);
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  
  // Serve static files from the dist directory in production
  app.use(express.static(path.resolve(__dirname, 'dist')));
  
  // API endpoint for OpenAI models
  app.get('/api/models', async (req, res) => {
    try {
      // Set proper content type
      res.setHeader('Content-Type', 'application/json');
      
      // This is a simplified example - in production you would call the OpenAI API
      const models = [
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'gpt-4', name: 'GPT-4' }
      ];
      
      // Return properly formatted JSON
      res.json({ data: models });
    } catch (error) {
      console.error('Error in /api/models:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // API endpoint for chat completions
  app.post('/api/chat', async (req, res) => {
    try {
      const { model, messages, temperature } = req.body;
      
      // Get API key from environment variable
      const apiKey = process.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: { message: 'OpenAI API key not configured' } });
      }
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-3.5-turbo',
          messages,
          temperature: temperature || 0.7,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json({ error });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: { message: error.message } });
    }
  });
  
  // All other GET requests not handled will return the React app
  app.get('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      
      // In production, serve the built index.html
      if (process.env.NODE_ENV === 'production') {
        return res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      }
      
      // In development, use Vite to transform and serve the index.html
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (error) {
      vite.ssrFixStacktrace(error);
      console.error(error);
      res.status(500).end(error.message);
    }
  });
  
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();
