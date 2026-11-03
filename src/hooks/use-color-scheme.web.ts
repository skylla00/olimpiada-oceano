import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Prefer the browser's actual scheme after hydration, but keep a stable light fallback
 * during server rendering to avoid hydration mismatches in static web rendering.
 */
export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}
