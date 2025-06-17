import { create } from 'zustand';

interface UIState {
  showLoginForm: boolean;
  setShowLoginForm: (show: boolean) => void;
}

export const useUIState = create<UIState>((set) => ({
  showLoginForm: false,
  setShowLoginForm: (show) => set({ showLoginForm: show }),
}));
