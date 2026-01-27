import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { getStorage } from '@/core/presentation/store/storage';

import type { ThemeMode } from '@/ui/theme/tokens';

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => getStorage()),
    }
  )
);
