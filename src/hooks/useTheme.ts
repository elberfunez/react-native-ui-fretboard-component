import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import type { ThemePreset, FretboardTheme } from '../types/Theme';
import { lightTheme, darkTheme } from '../types/Theme';

/**
 * Hook to resolve theme presets to actual theme objects
 * Supports 'auto' mode which respects system color scheme
 */
export function useTheme(themePreset?: ThemePreset): FretboardTheme {
  const systemColorScheme = useColorScheme();

  return useMemo(() => {
    // If theme is already an object, return it directly
    if (typeof themePreset === 'object') {
      return themePreset;
    }

    // Handle preset strings
    switch (themePreset) {
      case 'dark':
        return darkTheme;
      case 'auto':
        return systemColorScheme === 'dark' ? darkTheme : lightTheme;
      case 'light':
      default:
        return lightTheme;
    }
  }, [themePreset, systemColorScheme]);
}
