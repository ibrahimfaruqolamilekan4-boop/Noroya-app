
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.explore': 'Explore',
    'nav.feed': 'Feed',
    'nav.library': 'Dua Library',
    'nav.prayer': 'Prayer Guide',
    'nav.noor': 'Noor AI',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'hero.title': 'Explore the Prophetic Wisdom',
    'hero.subtitle': 'A refined Islamic encyclopedia and wisdom platform.',
    'dashboard.hero.title': 'Illuminate Your Soul\'s Path',
    'dashboard.hero.subtitle': '"Allah is the Light of the heavens and the earth."',
    'dashboard.hero.cta_feed': 'Enter the Feed',
    'dashboard.hero.cta_explore': 'Explore Wisdom',
    'dashboard.noor_ai.title': 'Noor AI Assistant',
    'dashboard.noor_ai.subtitle': 'Need immediate spiritual guidance or have a question about the Deen? Ask Noor AI.',
    'search.placeholder': 'Search by Prophet, Miracle, or Emotion...',
    'auth.sign_in': 'Sign In',
    'auth.sign_out': 'Sign Out',
  },
  ar: {
    'nav.dashboard': 'لوحة القيادة',
    'nav.explore': 'استكشاف',
    'nav.feed': 'الخلاصة',
    'nav.library': 'مكتبة الأذكار',
    'nav.prayer': 'دليل الصلاة',
    'nav.noor': 'نور الذكاء الاصطناعي',
    'nav.profile': 'الملف الشخصي',
    'nav.settings': 'الإعدادات',
    'hero.title': 'استكشف الحكمة النبوية',
    'hero.subtitle': 'منصة إسلامية راقية للموسوعة والحكمة.',
    'dashboard.hero.title': 'أنر مسار روحك',
    'dashboard.hero.subtitle': '"اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ"',
    'dashboard.hero.cta_feed': 'ادخل إلى الخلاصة',
    'dashboard.hero.cta_explore': 'استكشف الحكمة',
    'dashboard.noor_ai.title': 'مساعد نور الذكي',
    'dashboard.noor_ai.subtitle': 'هل تحتاج إلى إرشاد روحي فوري أو لديك سؤال عن الدين؟ اسأل نور.',
    'search.placeholder': 'ابحث عن نبي، معجزة، أو شعور...',
    'auth.sign_in': 'تسجيل الدخول',
    'auth.sign_out': 'تسجيل الخروج',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const isRTL = language === 'ar';

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
