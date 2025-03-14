import { Message, ModelParams } from '../../types/models';

// This is a mock implementation - in a real app, you would call actual APIs
export async function generateCompletion(
  modelId: string,
  messages: Message[],
  params: ModelParams
): Promise<{ 
  message: Message, 
  tokensUsed: { input: number, output: number },
  cost: number,
  responseTime: number
}> {
  // Simulate API call
  const startTime = performance.now();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Mock response
  const responseContent = `This is a mock response from the ${modelId} model.
  
You can replace this with actual API calls to OpenAI, Anthropic, or other providers.
  
\`\`\`javascript
// Example code block for syntax highlighting
function calculateTokens(text) {
  // A very rough approximation
  return text.split(/\s+/).length;
}
\`\`\`

The system prompt you provided was: "${params.systemPrompt}"`;

  // Calculate mock tokens and cost
  const inputTokens = messages.reduce((acc, msg) => acc + msg.content.length / 4, 0);
  const outputTokens = responseContent.length / 4;
  
  const endTime = performance.now();
  
  return {
    message: {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseContent,
      tokensUsed: Math.floor(outputTokens),
      cost: outputTokens * 0.00002,
      createdAt: new Date().toISOString(),
    },
    tokensUsed: {
      input: Math.floor(inputTokens),
      output: Math.floor(outputTokens),
    },
    cost: (inputTokens * 0.00001) + (outputTokens * 0.00002),
    responseTime: endTime - startTime
  };
}

// Function to estimate tokens in a text
export function estimateTokens(text: string): number {
  // This is a very rough approximation
  // In a real app, you would use a proper tokenizer
  return Math.ceil(text.length / 4);
} 