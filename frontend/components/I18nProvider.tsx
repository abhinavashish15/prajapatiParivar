'use client';

import { useEffect, useState, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n-config';

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('prajapati_lang') || 'en';
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang).then(() => {
        setIsReady(true);
      });
    } else {
      setIsReady(true);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
