import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
    getInitialLang,
    I18N_STORAGE_KEY,
    isLang,
    LANG_LABEL,
    resources,
    SUPPORTED_LANGS,
    type Lang,
} from "./i18n/i18n.config";

void i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLang(),
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

i18n.on("languageChanged", (lng) => {
    if (isLang(lng)) {
        document.documentElement.lang = lng;
        localStorage.setItem(I18N_STORAGE_KEY, lng);
    }
});

export { LANG_LABEL, SUPPORTED_LANGS, type Lang };
export { getInitialLang, isLang } from "./i18n/i18n.config";

export default i18n;
