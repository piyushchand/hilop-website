"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Types
type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  clearAllLanguagePreferences: () => void;
  isInitialized: boolean;
}

// Create Context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Function to clear all route-specific language preferences
export function clearAllLanguagePreferences() {
  if (typeof window === "undefined") return;

  // Get all localStorage keys
  const keys = Object.keys(localStorage);

  // Remove all language-related keys
  keys.forEach((key) => {
    if (key.startsWith("language_")) {
      localStorage.removeItem(key);
    }
  });
}

// Component that uses useSearchParams - wrapped in Suspense
function LanguageProviderInner({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create full route key including query parameters
  const fullRoute = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  useEffect(() => {
    // Get route-specific language from localStorage using full route
    const routeKey = `language_${fullRoute}`;
    const stored = localStorage.getItem(routeKey);

    if (stored === "en" || stored === "hi") {
      setLanguage(stored as Language);
    } else {
      // Default to English for new routes
      setLanguage("en");
    }

    setIsInitialized(true);
  }, [fullRoute]);

  const updateLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Store language preference for current route using full route
    const routeKey = `language_${fullRoute}`;
    localStorage.setItem(routeKey, newLanguage);
  };

  const clearPreferences = () => {
    clearAllLanguagePreferences();
    setLanguage("en"); // Reset current route to English
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: updateLanguage,
        clearAllLanguagePreferences: clearPreferences,
        isInitialized,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Provider with Suspense boundary
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <LanguageContext.Provider
          value={{
            language: "en",
            setLanguage: () => {},
            clearAllLanguagePreferences: () => {},
            isInitialized: false,
          }}
        >
          {children}
        </LanguageContext.Provider>
      }
    >
      <LanguageProviderInner>{children}</LanguageProviderInner>
    </Suspense>
  );
}

// Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
