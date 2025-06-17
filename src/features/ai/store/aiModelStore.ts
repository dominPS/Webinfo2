import { create } from 'zustand';

type AIModel = 'gpt-4' | 'claude-3.7' | 'claude-2.1';

interface AIModelState {
  currentModel: AIModel;
  setModel: (model: AIModel) => void;
}

export const useAIModelStore = create<AIModelState>((set) => ({
  currentModel: 'claude-3.7',
  setModel: (model) => set({ currentModel: model }),
}));
