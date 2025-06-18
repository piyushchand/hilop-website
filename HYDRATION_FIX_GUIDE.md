# Hydration Mismatch Fix Guide

## Overview

This guide addresses hydration mismatch errors in Next.js applications. Hydration mismatches occur when the server-rendered HTML doesn't match what the client renders, often due to:

1. **Browser-only APIs** (localStorage, window, document)
2. **Dynamic content** that differs between server and client
3. **State initialization** that depends on client-side data
4. **Conditional rendering** based on client-side state

## Root Causes Identified

### 1. Language Context with localStorage
**Problem**: Language preference was being read from localStorage during initialization, causing different states on server vs client.

**Solution**: 
- Created `useHydrationSafeState` hook
- Updated `LanguageContext` to use safe state management
- Added proper initialization checks

### 2. Navbar Component State Management
**Problem**: Multiple state dependencies (auth, language, mounted) causing inconsistent rendering.

**Solution**:
- Combined all initialization checks into single condition
- Added proper loading skeletons
- Ensured consistent rendering between server and client

### 3. Browser API Access
**Problem**: Direct access to `document.cookie`, `localStorage`, `window` without proper checks.

**Solution**:
- Created `ClientOnly` component for browser-dependent features
- Added `typeof window !== 'undefined'` checks
- Wrapped components that use browser APIs

## Implemented Solutions

### 1. Hydration-Safe State Hook

```typescript
// src/hooks/useHydrationSafeState.ts
export function useHydrationSafeState<T>(
  initialState: T,
  key?: string
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

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

  return [state, setState];
}
```

### 2. Client-Only Component

```typescript
// src/components/ClientOnly.tsx
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

### 3. Updated Language Context

```typescript
// src/contexts/LanguageContext.tsx
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useHydrationSafeString<Language>('en', 'language');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (language !== 'en' && language !== 'hi') {
      setLanguage('en');
    }
    setIsInitialized(true);
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

### 4. Improved Navbar Component

```typescript
// src/components/Navbar.tsx
const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { user, logout, isLoading, isInitialized } = useAuth();
  const { language, setLanguage, isInitialized: languageInitialized } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading skeleton until everything is initialized
  if (!mounted || !isInitialized || !languageInitialized) {
    return (
      <header className="sticky top-0 w-full border-b border-gray-200 bg-white z-50">
        {/* Loading skeleton */}
      </header>
    );
  }

  // Rest of component...
};
```

## Best Practices

### 1. Always Check for Browser Environment

```typescript
// ❌ Bad
const value = localStorage.getItem('key');

// ✅ Good
const value = typeof window !== 'undefined' ? localStorage.getItem('key') : null;
```

### 2. Use ClientOnly for Browser-Dependent Components

```typescript
// ❌ Bad
return <div>{document.cookie}</div>;

// ✅ Good
return (
  <ClientOnly>
    <div>{document.cookie}</div>
  </ClientOnly>
);
```

### 3. Provide Consistent Initial States

```typescript
// ❌ Bad
const [state, setState] = useState(getFromLocalStorage());

// ✅ Good
const [state, setState] = useHydrationSafeState(initialValue, 'storageKey');
```

### 4. Handle Loading States Properly

```typescript
// ❌ Bad
if (!user) return null;

// ✅ Good
if (!isInitialized) return <LoadingSkeleton />;
if (!user) return <LoginPrompt />;
```

## Testing Hydration Fixes

### 1. Development Testing
```bash
npm run dev
# Check browser console for hydration warnings
# Test with different user states (logged in/out)
# Test with different language preferences
```

### 2. Production Testing
```bash
npm run build
npm start
# Test the same scenarios in production mode
```

### 3. Common Test Cases
- [ ] Page loads without hydration warnings
- [ ] Language preference persists correctly
- [ ] Authentication state loads properly
- [ ] No content flashing during initialization
- [ ] Components render consistently on refresh

## Debugging Hydration Issues

### 1. Enable Strict Mode
```typescript
// next.config.ts
module.exports = {
  reactStrictMode: true,
}
```

### 2. Check Console Warnings
Look for:
- "Hydration failed because the server rendered HTML didn't match the client"
- "Text content does not match server-rendered HTML"
- "Expected server HTML to contain a matching element"

### 3. Use React DevTools
- Check component tree for mismatches
- Verify state consistency
- Monitor re-renders

### 4. Add Debug Logging
```typescript
useEffect(() => {
  console.log('Component mounted, state:', state);
}, [state]);
```

## Prevention Strategies

### 1. Code Review Checklist
- [ ] No direct browser API access without checks
- [ ] Consistent initial state between server and client
- [ ] Proper loading states for async data
- [ ] ClientOnly wrapper for browser-dependent features

### 2. Linting Rules
```json
// .eslintrc.json
{
  "rules": {
    "no-restricted-globals": [
      "error",
      {
        "name": "window",
        "message": "Use typeof window !== 'undefined' check"
      },
      {
        "name": "document", 
        "message": "Use typeof document !== 'undefined' check"
      }
    ]
  }
}
```

### 3. TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

## Common Patterns

### 1. Safe localStorage Access
```typescript
const getStoredValue = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
    return defaultValue;
  }
};
```

### 2. Conditional Rendering
```typescript
const Component = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <div>Client-only content</div>;
};
```

### 3. Async Data Loading
```typescript
const Component = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <ErrorMessage />;

  return <div>{data}</div>;
};
```

## Conclusion

Hydration mismatches are common in Next.js applications but can be prevented with proper patterns and tools. The key is to:

1. **Always check for browser environment** before using browser APIs
2. **Use consistent initial states** between server and client
3. **Provide proper loading states** for async operations
4. **Wrap browser-dependent components** with ClientOnly
5. **Test thoroughly** in both development and production modes

By following these patterns and using the provided utilities, you can build robust Next.js applications that avoid hydration mismatches. 