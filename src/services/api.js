import dedupRequest from '../utils/request-cache';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Fetch available models from the API
 */
export async function fetchModels() {
  return dedupRequest('models', async () => {
    const response = await fetch(`${API_URL}/api/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  });
}

/**
 * Send a message to the AI model
 */
export async function sendMessage(model, messages) {
  const requestKey = `message-${model}-${JSON.stringify(messages)}`;
  
  return dedupRequest(requestKey, async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  });
} 