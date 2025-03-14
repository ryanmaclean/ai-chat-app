// Simple API endpoint for models
export async function getModels() {
  // Return a static list of models
  return {
    data: [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      { id: 'gpt-4', name: 'GPT-4' }
    ]
  };
} 