import { Terminal } from "../components/Terminal";
import type { Lang } from "../i18n";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HeaderBar } from "../components/HeaderBar";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { AboutSection } from "../components/AboutSection";
import { StackSection } from "../components/StackSection";
import { CertsSection } from "../components/CertsSection";
import { ContactCard } from "../components/ContactCard";
import { loadI18nLanguage } from "../i18n";
import { CERTS, PROFILE, TECH_STACKS } from "../consts/consts";
import { SocialButtons } from "../components/SocialButtons";
import { GitHubAvatarButton } from "../components/GitHubAvatarButton";

export function HomePage() {
    const { t, i18n } = useTranslation();
    const lang: Lang = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";
    const [scrolled, setScrolled] = useState(false);
    const [activePath, setActivePath] = useState<string>("");

    const [i18nError, setI18nError] = useState<Error | null>(null);
    const [i18nReady, setI18nReady] = useState(false);
    const [languageSwitching, setLanguageSwitching] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const handleRetry = useCallback(() => {
        setI18nError(null);
        setI18nReady(false);
        setLanguageSwitching(false);
        setRetryCount((prev) => prev + 1);
    }, []);

    useEffect(() => {
        let cancelled = false;

        void (async () => {
            try {
                await loadI18nLanguage(i18n.language as Lang);
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
    }, [retryCount, i18n.language]);

    const handleLangChange = useCallback(
        async (next: Lang) => {
            if (next === lang) return;
            if (languageSwitching) return;

            try {
                setLanguageSwitching(true);
                await loadI18nLanguage(next);
                await i18n.changeLanguage(next);

                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => resolve());
                });
            } catch (e) {
                console.error(e);
                setI18nError(e instanceof Error ? e : new Error(String(e)));
            } finally {
                setLanguageSwitching(false);
            }
        },
        [i18n, languageSwitching, lang],
    );

    const aboutItems = t("about.items", { returnObjects: true });
    const aboutList: string[] = Array.isArray(aboutItems)
        ? aboutItems.filter((it): it is string => typeof it === "string")
        : [];

    useEffect(() => {
        const name = PROFILE.name;
        document.title = t("meta.title", { name });
    }, [lang, t]);

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 8);

            const anchorY = 120;
            const sections: Array<{ id: string; segment: string }> = [
                { id: "about", segment: "about" },
                { id: "stack", segment: "tech-stacks" },
                { id: "certs", segment: "certificates" },
            ];

            let nextPath = "";
            for (const s of sections) {
                const el = document.getElementById(s.id);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= anchorY && rect.bottom > anchorY) {
                    nextPath = `/${s.segment}`;
                    break;
                }
            }

            setActivePath(nextPath);
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (i18nError) {
        return (
            <div className="min-h-dvh relative">
                <div className="bg-grid" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="mx-4 flex max-w-md flex-col items-center gap-4 text-center">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                                {t("error.title")}
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                {t("error.message")}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-500 dark:focus:ring-offset-2"
                        >
                            {t("error.retry")}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!i18nReady) {
        return (
            <div className="min-h-dvh relative" aria-busy="true">
                <div className="bg-grid" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4" role="status">
                        <div
                            className="h-12 w-12 animate-spin rounded-full border-2 border-slate-400 border-t-transparent dark:border-slate-500 dark:border-t-transparent"
                            aria-hidden="true"
                        />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300" aria-live="polite">
                            {t("loading")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh">
            <div className="bg-grid" />

            <HeaderBar
                scrolled={scrolled}
                activePath={activePath}
                lang={lang}
                onLangChange={handleLangChange}
                langDisabled={languageSwitching}
                linkedInUrl={PROFILE.contact.linkedin}
            />

            <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
                <header className="flex flex-col gap-7">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                                    {PROFILE.name}
                                </h1>
                                <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                                    @masteryyh
                                </span>
                            </div>

                            {!scrolled ? (
                                <div className="hidden items-center gap-2 sm:flex">
                                    <SocialButtons linkedInUrl={PROFILE.contact.linkedin} className="flex" />

                                    <ThemeToggle />

                                    <div className="hidden sm:block">
                                        <LanguageToggle
                                            value={lang}
                                            onChange={handleLangChange}
                                            disabled={languageSwitching}
                                        />
                                    </div>

                                    <GitHubAvatarButton />
                                </div>
                            ) : null}
                        </div>

                        <p className="text-balance text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                            {t("header.tagline")}
                        </p>
                    </div>

                    <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                        <Terminal
                            title="~/portfolio"
                            name={PROFILE.name}
                            line2={t("terminal.line2")}
                            contact={PROFILE.contact}
                        />

                        <ContactCard contact={PROFILE.contact} />
                    </div>
                </header>

                <main className="mt-9 grid gap-8 sm:mt-10 sm:gap-10">
                    <AboutSection title={t("about.title")} items={aboutList} />

                    <StackSection
                        title={t("stack.title")}
                        groups={
                            Object.entries(TECH_STACKS).map(([group, items]) => ({
                                title: t(group),
                                items,
                            }))
                        }
                    />

                    <CertsSection
                        title={t("cert.title")}
                        validLabel={t("cert.valid")}
                        viewLabel={t("cert.viewOnCredly")}
                        certs={
                            CERTS.map((c) => ({
                                name: c.name,
                                issuer: `${t(c.issuer)}`,
                                year: c.year,
                                href: c.href,
                            }))
                        }
                    />
                </main>

                <footer className="mt-12 border-t border-slate-200 py-6 text-xs text-slate-600 dark:border-slate-800/70 dark:text-slate-400 sm:py-8 sm:text-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="text-slate-900 dark:text-slate-300">masteryyh</span> • {t("footer.builtWith")}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
