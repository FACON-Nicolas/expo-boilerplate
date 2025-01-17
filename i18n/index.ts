import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import translationFr from './fr.json';
import translationEn from './en.json';

const resources = {
  fr: { translation: translationFr },
  en: { translation: translationEn },
};

const initI18n = async () => {
  const userLanguage = Localization.getLocales()[0].languageCode || 'en';
  i18n.use(initReactI18next).init({
    resources,
    lng: userLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
