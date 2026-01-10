import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { get } from "./utils/request";

import {
    getInitialLang,
    I18N_STORAGE_KEY,
    isLang,
    LANG_LABEL,
    SUPPORTED_LANGS,
    type Lang,
} from "./i18n/i18n.config";

type TranslationResource = Record<string, unknown>;

const loadedLangs = new Set<Lang>();
const loadPromises = new Map<Lang, Promise<void>>();

i18n.on("languageChanged", (lng) => {
    if (isLang(lng)) {
        document.documentElement.lang = lng;
        localStorage.setItem(I18N_STORAGE_KEY, lng);
    }
});

const initialLang = getInitialLang();
document.documentElement.lang = initialLang;

const initPromise = i18n.use(initReactI18next).init({
    resources: {
        "zh-CN": {
            translation: {
                meta: { title: "masteryyh's home" },
                loading: "加载中...",
                error: {
                    title: "发生甚么事了?",
                    message: "无法加载页面数据。请刷新页面重试。",
                    retry: "重试",
                },
                auth: {
                    github: {
                        loading: "加载中...",
                        login: "使用 GitHub 登录",
                        loggedInAs: "已登录：{{login}}",
                        menuLabel: "GitHub 账号菜单",
                        logout: "退出登录",
                    },
                },
            },
        },
        en: {
            translation: {
                meta: { title: "masteryyh's home" },
                loading: "Loading...",
                error: {
                    title: "Oops...",
                    message: "Unable to load page data. Please refresh the page to try again.",
                    retry: "Retry",
                },
                auth: {
                    github: {
                        loading: "Loading…",
                        login: "Login with GitHub",
                        loggedInAs: "Logged in as {{login}}",
                        menuLabel: "GitHub account menu",
                        logout: "Logout",
                    },
                },
            },
        },
    },
    lng: initialLang,
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGS,
    interpolation: {
        escapeValue: false,
    },
});

export async function loadI18nLanguage(lang: Lang): Promise<void> {
    await initPromise;

    if (loadedLangs.has(lang)) return;

    const existing = loadPromises.get(lang);
    if (existing) return existing;

    const baseUrl = import.meta.env.BASE_URL.replace(/\/+$/, "");
    const resourcesBase = `${baseUrl}/assets/i18n`;

    const promise = (async () => {
        const resource = await get<TranslationResource>(`${resourcesBase}/${lang}.json`);
        i18n.addResourceBundle(lang, "translation", resource, true, true);
        loadedLangs.add(lang);
    })();

    loadPromises.set(lang, promise);

    try {
        await promise;
    } catch (e) {
        loadPromises.delete(lang);
        throw e;
    }
}

export { LANG_LABEL, SUPPORTED_LANGS, type Lang };
export { getInitialLang, isLang } from "./i18n/i18n.config";

export default i18n;
