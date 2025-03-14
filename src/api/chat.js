// Real API endpoint for chat
export async function sendChatMessage(model, messages, temperature) {
  try {
    const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!API_KEY) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Ensure we have a system message at the beginning
    let apiMessages = [...messages];
    if (!apiMessages.some(msg => msg.role === 'system')) {
      apiMessages.unshift({ 
        role: 'system', 
        content: 'You are a helpful AI assistant.' 
      });
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        temperature: temperature,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    
    // If there's an error, return a fallback response
    const errorMessage = `I encountered an error: ${error.message}. Please check your API key and network connection.`;
    
    return {
      choices: [
        {
          message: {
            role: 'assistant',
            content: errorMessage
          }
        }
      ],
      usage: {
        prompt_tokens: Array.isArray(messages) 
          ? messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0) / 4 
          : 0,
        completion_tokens: errorMessage.length / 4,
        total_tokens: (Array.isArray(messages) 
          ? messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0) / 4 
          : 0) + (errorMessage.length / 4)
      }
    };
  }
} 