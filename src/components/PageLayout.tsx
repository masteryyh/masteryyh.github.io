import type { ReactNode } from "react";
import type { TFunction } from "i18next";
import type { Lang } from "../i18n";
import { useTranslation } from "react-i18next";
import { useI18nLoader } from "../hooks/useI18nLoader";
import { useLanguageSwitcher } from "../hooks/useLanguageSwitcher";
import { useScrollState } from "../hooks/useScrollState";
import { HeaderBar } from "./HeaderBar";
import { PROFILE } from "../consts/consts";

export type LayoutContext = {
    t: TFunction;
    lang: Lang;
    scrolled: boolean;
    handleLangChange: (lang: Lang) => void;
    languageSwitching: boolean;
};

type PageLayoutProps = {
    basePath?: string;
    activePath: string;
    loadingFallback?: ReactNode;
    children: (ctx: LayoutContext) => ReactNode;
};

export function PageLayout({ basePath, activePath, loadingFallback, children }: PageLayoutProps) {
    const { t, i18n } = useTranslation();
    const lang: Lang = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";

    const { i18nError, i18nReady, handleRetry } = useI18nLoader(i18n.language);
    const { languageSwitching, handleLangChange } = useLanguageSwitcher(i18n, lang);
    const scrolled = useScrollState(8);

    if (i18nError) {
        return (
            <div className="min-h-dvh relative">
                <div className="bg-dots" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="mx-4 flex max-w-md flex-col items-center gap-4 text-center">
                        <div className="flex flex-col gap-2">
                            <h1 className="font-mono text-xl font-semibold text-text-primary">
                                {t("error.title")}
                            </h1>
                            <p className="text-sm text-text-secondary">{t("error.message")}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="rounded border border-accent bg-transparent px-4 py-2 font-mono text-sm font-medium text-accent transition-colors duration-200 hover:bg-accent-muted"
                        >
                            {t("error.retry")}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!i18nReady) {
        if (loadingFallback) {
            return <>{loadingFallback}</>;
        }

        return (
            <div className="min-h-dvh relative" aria-busy="true">
                <div className="bg-dots" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4" role="status">
                        <div
                            className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"
                            aria-hidden="true"
                        />
                        <p className="font-mono text-sm text-text-secondary" aria-live="polite">
                            {t("loading")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const ctx: LayoutContext = { t, lang, scrolled, handleLangChange, languageSwitching };

    return (
        <div className="min-h-dvh">
            <div className="bg-dots" />

            <HeaderBar
                scrolled={scrolled}
                activePath={activePath}
                lang={lang}
                onLangChange={handleLangChange}
                langDisabled={languageSwitching}
                basePath={basePath}
                linkedInUrl={PROFILE.contact.linkedin}
            />

            <div id="main-content" className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
                {children(ctx)}

                <footer className="mt-12 border-t border-border py-6 font-mono text-xs text-text-muted sm:py-8 sm:text-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="text-text-secondary">masteryyh</span>{" "}
                            <span className="text-text-muted">•</span>{" "}
                            {t("footer.builtWith")}
                        </div>
                        <div className="flex items-center gap-3 sm:hidden">
                            <a
                                href={PROFILE.contact.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-text-muted transition-colors duration-200 hover:text-text-secondary"
                                aria-label="GitHub"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                GitHub
                            </a>
                            <a
                                href={PROFILE.contact.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-text-muted transition-colors duration-200 hover:text-text-secondary"
                                aria-label="LinkedIn"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
