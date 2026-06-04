import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../public/locales/en/translation.json';
import hiTranslation from '../public/locales/hi/translation.json';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enTranslation,
        },
        hi: {
          translation: hiTranslation,
        },
      },
      // Supported languages
      supportedLngs: ['en', 'hi'],
      fallbackLng: 'en',
      lng: 'en', // Default language is English during server side render

      // Default namespace
      defaultNS: 'translation',
      ns: ['translation'],

      // Don't escape HTML in translations
      interpolation: {
        escapeValue: false,
      },

      // React Suspense — don't use it
      react: {
        useSuspense: false,
      },

      // Initialize synchronously to prevent SSR hydration mismatch
      initImmediate: false,
    } as any);
}

export default i18n;
