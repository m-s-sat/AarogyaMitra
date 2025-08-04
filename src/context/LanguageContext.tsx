import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types/index.ts';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  availableLanguages: Language[];
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

// Basic translations - in a real app, these would come from JSON files
const translations: Record<string, Record<string, string>> = {
  en: {
    'hero.tagline': 'Your Health, Your Language, Your Friend',
    'hero.subtitle': 'Get personalized healthcare assistance in your preferred language with AI-powered support',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'features.appointments': 'Book Appointments',
    'features.reports': 'Store Reports',
    'features.chatbot': 'AI Chatbot',
    'features.emergency': 'Emergency SOS',
    'dashboard.greeting': 'Hello {name}, how can we help you today?',
    'booking.success': 'Appointment confirmed! WhatsApp alert will be sent shortly.',
  },
  hi: {
    'hero.tagline': 'आपका स्वास्थ्य, आपकी भाषा, आपका मित्र',
    'hero.subtitle': 'AI-संचालित सहायता के साथ अपनी पसंदीदा भाषा में व्यक्तिगत स्वास्थ्य सेवा सहायता प्राप्त करें',
    'nav.login': 'लॉगिन',
    'nav.signup': 'साइन अप',
    'features.appointments': 'अपॉइंटमेंट बुक करें',
    'features.reports': 'रिपोर्ट स्टोर करें',
    'features.chatbot': 'AI चैटबॉट',
    'features.emergency': 'आपातकालीन SOS',
    'dashboard.greeting': 'नमस्ते {name}, आज हम आपकी कैसे सहायता कर सकते हैं?',
    'booking.success': 'अपॉइंटमेंट की पुष्टि हो गई! व्हाट्सऐप अलर्ट जल्द ही भेजा जाएगा।',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('preferred_language');
    if (storedLanguage) {
      const language = languages.find(lang => lang.code === storedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred_language', language.code);
  };

  const t = (key: string, replacements?: Record<string, string>) => {
    let translation = translations[currentLanguage.code]?.[key] || translations.en[key] || key;
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        translation = translation.replace(`{${placeholder}}`, value);
      });
    }
    
    return translation;
  };

  const value = {
    currentLanguage,
    setLanguage,
    availableLanguages: languages,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};