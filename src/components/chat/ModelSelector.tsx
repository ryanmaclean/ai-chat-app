import React from 'react';
import { modelProviders } from '../../lib/models/providers';
import { Model, ModelParams } from '../../types/models';

interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  modelParams: ModelParams;
  onModelParamsChange: (params: Partial<ModelParams>) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onModelChange,
  modelParams,
  onModelParamsChange
}) => {
  // Find the currently selected model
  let selectedModel: Model | null = null;
  for (const provider of modelProviders) {
    const model = provider.models.find(m => m.id === selectedModelId);
    if (model) {
      selectedModel = model;
      break;
    }
  }

  return (
    <div className="glass-morphism p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Model Settings</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Model</label>
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-2"
          value={selectedModelId}
          onChange={(e) => onModelChange(e.target.value)}
        >
          {modelProviders.map((provider) => (
            <optgroup key={provider.id} label={provider.name}>
              {provider.models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Temperature: {modelParams.temperature.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max={selectedModel?.maxTemperature || 1}
          step="0.1"
          value={modelParams.temperature}
          onChange={(e) => onModelParamsChange({ temperature: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Max Tokens: {modelParams.maxTokens}
        </label>
        <input
          type="range"
          min="100"
          max={selectedModel ? Math.min(selectedModel.contextSize, 4000) : 2000}
          step="100"
          value={modelParams.maxTokens}
          onChange={(e) => onModelParamsChange({ maxTokens: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">System Prompt</label>
        <textarea
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 resize-none"
          rows={3}
          value={modelParams.systemPrompt}
          onChange={(e) => onModelParamsChange({ systemPrompt: e.target.value })}
          placeholder="Instructions for the AI..."
        />
      </div>
    </div>
  );
};

export default ModelSelector; 