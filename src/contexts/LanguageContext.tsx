"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHydrationSafeString } from '@/hooks/useHydrationSafeState';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useHydrationSafeString<Language>('en', 'language');
  const [isInitialized, setIsInitialized] = useState(false);

  // Validate language value and set initialization
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

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 