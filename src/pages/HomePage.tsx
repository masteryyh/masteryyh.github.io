import { Terminal } from "../components/Terminal";
import type { Lang } from "../i18n";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HeaderBar } from "../components/HeaderBar";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { AboutSection } from "../components/AboutSection";
import { StackSection } from "../components/StackSection";
import { CertsSection } from "../components/CertsSection";
import { ContactCard } from "../components/ContactCard";
import { CERTS, PROFILE, TECH_STACKS } from "../consts/consts";
import { SocialButtons } from "../components/SocialButtons";
import { GitHubAvatarButton } from "../components/GitHubAvatarButton";
import { BlogSection } from "../blog/components/BlogSection";
import { useI18nLoader } from "../hooks/useI18nLoader";
import { useLanguageSwitcher } from "../hooks/useLanguageSwitcher";
import { useScrollState } from "../hooks/useScrollState";

export function HomePage() {
    const { t, i18n } = useTranslation();
    const lang: Lang = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";
    const [activePath, setActivePath] = useState<string>("");

    const { i18nError, i18nReady, handleRetry } = useI18nLoader(i18n.language);
    const { languageSwitching, handleLangChange } = useLanguageSwitcher(i18n, lang);
    const scrolled = useScrollState(8);

    const aboutItems = t("about.items", { returnObjects: true });
    const aboutList: string[] = Array.isArray(aboutItems)
        ? aboutItems.filter((it): it is string => typeof it === "string")
        : [];

    useEffect(() => {
        const name = PROFILE.name;
        document.title = t("meta.title", { name });
    }, [lang, t]);

    const sections = useMemo(
        () => [
            { id: "about", segment: "about" },
            { id: "stack", segment: "tech-stacks" },
            { id: "certs", segment: "certificates" },
        ],
        [],
    );

    useEffect(() => {
        function updateActivePath() {
            const anchorY = 120;
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

        updateActivePath();
        window.addEventListener("scroll", updateActivePath, { passive: true });
        return () => window.removeEventListener("scroll", updateActivePath);
    }, [sections]);

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
                            <p className="text-sm text-slate-600 dark:text-slate-300">{t("error.message")}</p>
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
                <header className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-2">
                                <h1 className="break-words bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-slate-50 dark:to-slate-300 sm:text-4xl">
                                    {PROFILE.name}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                                        @masteryyh
                                    </span>
                                    <span
                                        className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600"
                                        aria-hidden="true"
                                    />
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Backend / Fullstack / DevOps
                                    </span>
                                </div>
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

                        <p className="max-w-2xl text-balance text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
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
                        groups={Object.entries(TECH_STACKS).map(([group, items]) => ({
                            title: t(group),
                            items,
                        }))}
                    />

                    <CertsSection
                        title={t("cert.title")}
                        validLabel={t("cert.valid")}
                        viewLabel={t("cert.viewOnCredly")}
                        certs={CERTS.map((c) => ({
                            name: c.name,
                            issuer: `${t(c.issuer)}`,
                            year: c.year,
                            href: c.href,
                        }))}
                    />

                    <BlogSection />
                </main>

                <footer className="mt-12 border-t border-slate-200 py-6 text-xs text-slate-600 dark:border-slate-800/70 dark:text-slate-400 sm:py-8 sm:text-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="text-slate-900 dark:text-slate-300">masteryyh</span> •{" "}
                            {t("footer.builtWith")}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
