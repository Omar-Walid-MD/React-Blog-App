import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationAR from "./translations/ar.json";
import translationEN from "./translations/en.json";

const resources = {
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar",
    interpolation: {
      escapeValue: false
    },
    react: {
        useSuspense: false
    }
  });

document.body.setAttribute("lng",i18n.language);
console.log(i18n.language);

export default i18n;