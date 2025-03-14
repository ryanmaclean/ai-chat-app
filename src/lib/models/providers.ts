import { ModelProvider } from '../../types/models';

export const modelProviders: ModelProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        contextSize: 128000,
        costPer1kTokensInput: 0.01,
        costPer1kTokensOutput: 0.03,
        maxTemperature: 2.0,
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        contextSize: 128000,
        costPer1kTokensInput: 0.01,
        costPer1kTokensOutput: 0.03,
        maxTemperature: 2.0,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        contextSize: 16385,
        costPer1kTokensInput: 0.0005,
        costPer1kTokensOutput: 0.0015,
        maxTemperature: 2.0,
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        contextSize: 200000,
        costPer1kTokensInput: 0.015,
        costPer1kTokensOutput: 0.075,
        maxTemperature: 1.0,
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        contextSize: 200000,
        costPer1kTokensInput: 0.003,
        costPer1kTokensOutput: 0.015,
        maxTemperature: 1.0,
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        contextSize: 200000,
        costPer1kTokensInput: 0.00025,
        costPer1kTokensOutput: 0.00125,
        maxTemperature: 1.0,
      },
    ],
  },
];

export const getModelById = (modelId: string) => {
  for (const provider of modelProviders) {
    const model = provider.models.find(m => m.id === modelId);
    if (model) {
      return { provider, model };
    }
  }
  return null;
}; 