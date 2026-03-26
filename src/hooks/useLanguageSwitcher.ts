import { useCallback, useRef, useState } from "react";
import type { i18n } from "i18next";
import { loadI18nLanguage } from "../i18n";
import type { Lang } from "../i18n";

export function useLanguageSwitcher(i18n: i18n, currentLang: Lang) {
    const [languageSwitching, setLanguageSwitching] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const switchingRef = useRef(false);

    const handleLangChange = useCallback(
        async (next: Lang) => {
            if (next === currentLang) return;
            if (switchingRef.current) return;

            try {
                switchingRef.current = true;
                setLanguageSwitching(true);
                setError(null);
                await loadI18nLanguage(next);
                await i18n.changeLanguage(next);

                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => resolve());
                });
            } catch (e) {
                console.error(e);
                setError(e instanceof Error ? e : new Error(String(e)));
            } finally {
                switchingRef.current = false;
                setLanguageSwitching(false);
            }
        },
        [i18n, currentLang],
    );

    return { languageSwitching, switchError: error, handleLangChange };
}
