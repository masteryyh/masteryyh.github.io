import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "./types";
import { loadAllBlogPosts } from "./loader";
import { BlogCard } from "./components/BlogCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import type { Lang } from "../i18n";
import { loadI18nLanguage } from "../i18n";
import { HeaderBar } from "../components/HeaderBar";
import { SocialButtons } from "../components/SocialButtons";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { GitHubAvatarButton } from "../components/GitHubAvatarButton";
import { PROFILE } from "../consts/consts";

export function BlogListPage() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const lang: Lang = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";
    const [scrolled, setScrolled] = useState(false);

    const [i18nError, setI18nError] = useState<Error | null>(null);
    const [i18nReady, setI18nReady] = useState(false);
    const [languageSwitching, setLanguageSwitching] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const activePath = useMemo(() => {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/+$/, "");
        const raw = location.pathname;
        const stripped = baseUrl && raw.startsWith(baseUrl) ? raw.slice(baseUrl.length) : raw;
        return stripped || "/";
    }, [location.pathname]);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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
        [i18n, lang, languageSwitching],
    );

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 8);
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!i18nReady) return;

        void (async () => {
            try {
                setLoading(true);
                setError(null);
                const allPosts = await loadAllBlogPosts(lang);
                setPosts(allPosts);
            } catch (e) {
                console.error("Failed to load blog posts:", e);
                setError(e instanceof Error ? e : new Error(String(e)));
            } finally {
                setLoading(false);
            }
        })();
    }, [i18nReady, lang]);

    useEffect(() => {
        document.title = `${t("blog.title")} • masteryyh's home`;
    }, [lang, t]);

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
                basePath="~/portfolio"
                linkedInUrl={PROFILE.contact.linkedin}
            />

            <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
                <header className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                            <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                                {t("blog.title")}
                            </h1>
                            <span className="font-mono text-sm text-slate-500 dark:text-slate-400">~/blogs</span>
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
                        {t("blog.subtitle")}
                    </p>
                </header>

                <main className="mt-9 grid gap-6 sm:mt-10 sm:gap-8">
                    <div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
                            {t("blog.backToHome")}
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="h-40 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800"
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                            <div className="font-semibold">{t("blog.errorLoading")}</div>
                            <div className="mt-1 text-xs opacity-90">{error.message}</div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                            {t("blog.noPosts")}
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
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
