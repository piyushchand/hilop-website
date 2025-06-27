"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isInitialized: boolean;
}

// Create Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Safe hook for hydration/localStorage (no reload)
function useHydrationSafeString(defaultValue: string, key: string): [string, (val: string) => void] {
  const [value, setValue] = useState(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored === "en" || stored === "hi") {
      setValue(stored);
    }
    setHydrated(true);
  }, [key]);

  const updateValue = (val: string) => {
    setValue(val);
    localStorage.setItem(key, val);
  };

  return [hydrated ? value : defaultValue, updateValue];
}

// Provider
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useHydrationSafeString("en", "language") as [
    Language,
    (lang: Language) => void
  ];
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (language !== "en" && language !== "hi") {
      setLanguage("en");
    }
    setIsInitialized(true);
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isInitialized }}>
      {children}
    </LanguageContext.Provider>
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
