import { useEffect } from 'react';
import { Uniwind } from 'uniwind';

import { useThemeStore } from '@/ui/theme/theme-store';

import type { ThemeMode } from '@/ui/theme/tokens';

type ThemeSyncState = {
  mode: ThemeMode;
  isThemeStoreHydrated: boolean;
};

export function useThemeSync(): ThemeSyncState {
  const mode = useThemeStore((state) => state.mode);
  const isThemeStoreHydrated = useThemeStore.persist.hasHydrated();

  useEffect(() => {
    Uniwind.setTheme(mode);
  }, [mode]);

  return { mode, isThemeStoreHydrated };
}
