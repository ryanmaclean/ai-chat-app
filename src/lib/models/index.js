import { modelProviders } from './providers';

// Function to estimate tokens in a text
export function estimateTokens(text) {
  // This is a rough approximation
  return Math.ceil(text.length / 4);
}

// Get model by ID
export function getModelById(modelId) {
  for (const provider of modelProviders) {
    const model = provider.models.find(m => m.id === modelId);
    if (model) {
      return { provider, model };
    }
  }
  return null;
}

// Calculate cost based on tokens and model
export function calculateCost(modelId, inputTokens, outputTokens) {
  const modelInfo = getModelById(modelId);
  if (!modelInfo) return 0;
  
  const { model } = modelInfo;
  return (inputTokens * model.costPer1kTokensInput / 1000) + 
         (outputTokens * model.costPer1kTokensOutput / 1000);
}

// Generate completion with Datadog tracing
export async function generateCompletion(modelId, messages, params) {
  // Get llmobs from window (initialized in main.jsx)
  const { llmobs } = window;
  
  // Use Datadog's LLM tracing
  return llmobs.wrap({ 
    kind: 'llm', 
    modelName: modelId, 
    modelProvider: getModelById(modelId)?.provider?.name || 'custom' 
  }, async () => {
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
  return text.split(/\\s+/).length;
}
\`\`\`

The system prompt you provided was: "${params.systemPrompt}"`;

    // Calculate mock tokens and cost
    const inputTokens = messages.reduce((acc, msg) => acc + estimateTokens(msg.content), 0);
    const outputTokens = estimateTokens(responseContent);
    const cost = calculateCost(modelId, inputTokens, outputTokens);
    
    const endTime = performance.now();
    
    // Annotate the span with input/output data and metrics
    llmobs.annotate({
      inputData: messages.map(msg => ({ role: msg.role, content: msg.content })),
      outputData: [{ role: 'assistant', content: responseContent }],
      metrics: {
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_tokens: inputTokens + outputTokens,
        response_time_ms: endTime - startTime
      },
      metadata: {
        temperature: params.temperature,
        max_tokens: params.maxTokens,
        model: modelId
      }
    });
    
    return {
      message: {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseContent,
        tokensUsed: Math.floor(outputTokens),
        cost: cost,
        createdAt: new Date().toISOString(),
      },
      tokensUsed: {
        input: Math.floor(inputTokens),
        output: Math.floor(outputTokens),
      },
      cost: cost,
      responseTime: endTime - startTime
    };
  })();
}

export { modelProviders }; 