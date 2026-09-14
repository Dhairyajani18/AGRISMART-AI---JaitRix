import React, { createContext, useContext, useEffect, useState } from 'react';
import { en } from '../i18n/en';
import { hi } from '../i18n/hi';
import { gu } from '../i18n/gu';

export type LanguageCode = 'en' | 'hi' | 'gu';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', flag: '🇮🇳' },
];

export type Translations = typeof en;

interface LanguageContextType {
  language: LanguageCode;
  t: Translations;
  setLanguage: (lang: LanguageCode) => void;
  availableLanguages: LanguageOption[];
}

const translationsMap: Record<LanguageCode, Translations> = {
  en,
  hi,
  gu,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'agrismart_language_pref';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'hi' || saved === 'gu') {
        return saved;
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    // Dynamically update document html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    t: translationsMap[language] || en,
    setLanguage,
    availableLanguages: SUPPORTED_LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
