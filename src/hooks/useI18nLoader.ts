import { useCallback, useEffect, useState } from "react";
import { loadI18nLanguage } from "../i18n";
import type { Lang } from "../i18n";

export function useI18nLoader(currentLanguage: string) {
    const [i18nError, setI18nError] = useState<Error | null>(null);
    const [i18nReady, setI18nReady] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const handleRetry = useCallback(() => {
        setI18nError(null);
        setI18nReady(false);
        setRetryCount((prev) => prev + 1);
    }, []);

    useEffect(() => {
        let cancelled = false;

        void (async () => {
            try {
                await loadI18nLanguage(currentLanguage as Lang);
                if (!cancelled) {
                    setI18nReady(true);
                }
            } catch (e) {
                if (!cancelled) {
                    console.error(e);
                    setI18nError(e instanceof Error ? e : new Error(String(e)));
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [retryCount, currentLanguage]);

    return { i18nError, i18nReady, handleRetry };
}
