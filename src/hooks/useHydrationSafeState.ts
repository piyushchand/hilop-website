import { useState, useEffect } from 'react';

/**
 * A hook that safely manages state to prevent hydration mismatches
 * @param initialState The initial state value
 * @param key Optional key for localStorage persistence
 * @returns [state, setState] tuple
 */
export function useHydrationSafeState<T>(
  initialState: T,
  key?: string
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage if key is provided
  useEffect(() => {
    if (key && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          setState(parsed);
        }
      } catch (error) {
        console.warn(`Failed to load state from localStorage for key "${key}":`, error);
      }
    }
    setIsHydrated(true);
  }, [key]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (key && isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.warn(`Failed to save state to localStorage for key "${key}":`, error);
      }
    }
  }, [state, key, isHydrated]);

  return [state, setState];
}

/**
 * A hook that safely manages boolean state to prevent hydration mismatches
 * @param initialValue The initial boolean value
 * @param key Optional key for localStorage persistence
 * @returns [value, setValue] tuple
 */
export function useHydrationSafeBoolean(
  initialValue: boolean,
  key?: string
): [boolean, (value: boolean | ((prev: boolean) => boolean)) => void] {
  return useHydrationSafeState(initialValue, key);
}

/**
 * A hook that safely manages string state to prevent hydration mismatches
 * @param initialValue The initial string value
 * @param key Optional key for localStorage persistence
 * @returns [value, setValue] tuple
 */
export function useHydrationSafeString(
  initialValue: string,
  key?: string
): [string, (value: string | ((prev: string) => string)) => void] {
  return useHydrationSafeState(initialValue, key);
} 