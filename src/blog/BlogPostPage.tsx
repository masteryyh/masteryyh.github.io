import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "./types";
import { loadBlogPost } from "./loader";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faCalendar,
    faClock,
    faTag,
} from "@fortawesome/free-solid-svg-icons";
import type { Lang } from "../i18n";
import { loadI18nLanguage } from "../i18n";
import { HeaderBar } from "../components/HeaderBar";
import { SocialButtons } from "../components/SocialButtons";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { GitHubAvatarButton } from "../components/GitHubAvatarButton";
import { PROFILE } from "../consts/consts";

export function BlogPostPage() {
    const { id } = useParams<{ id: string }>();
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
    const [post, setPost] = useState<BlogPost | null>(null);
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
        if (!id) return;

        if (!i18nReady) return;

        void (async () => {
            try {
                setLoading(true);
                setError(null);
                const blogPost = await loadBlogPost(id, lang);
                setPost(blogPost);
            } catch (e) {
                console.error("Failed to load blog post:", e);
                setError(e instanceof Error ? e : new Error(String(e)));
            } finally {
                setLoading(false);
            }
        })();
    }, [id, i18nReady, lang]);

    useEffect(() => {
        if (post?.title) {
            document.title = `${post.title} • masteryyh's home`;
        } else {
            document.title = `${t("blog.title")} • masteryyh's home`;
        }
    }, [lang, post?.title, t]);

    if (!id) {
        return <Navigate to="/blogs" replace />;
    }

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
                </header>

                <main className="mt-9 grid gap-6 sm:mt-10 sm:gap-8">
                    <div>
                        <Link
                            to="/blogs"
                            className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
                            {t("blog.backToBlog")}
                        </Link>
                    </div>

                    <div className="mx-auto w-full max-w-4xl">
                        {loading ? (
                            <div>
                                <div className="mb-8 h-6 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="mb-12 space-y-4">
                                    <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                    <div className="h-6 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                                </div>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-800"
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : error || !post ? (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                                <p className="mb-2 font-semibold">{t("blog.postNotFound")}</p>
                                {error && <p className="text-sm">{error.message}</p>}
                            </div>
                        ) : (
                            <article>
                                <header className="mb-10">
                                    <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                                        {post.title}
                                    </h2>

                                    <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                                        {post.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
                                        <span className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
                                            {new Date(post.date).toLocaleDateString()}
                                        </span>

                                        {post.readingTime && (
                                            <span className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                                                {post.readingTime} {t("blog.minRead")}
                                            </span>
                                        )}

                                        {post.tags && post.tags.length > 0 && (
                                            <span className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faTag} className="h-4 w-4" />
                                                {post.tags.join(", ")}
                                            </span>
                                        )}
                                    </div>
                                </header>

                                <MarkdownRenderer content={post.content || ""} />

                                <footer className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
                                    <Link
                                        to="/blogs"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
                                        {t("blog.backToBlog")}
                                    </Link>
                                </footer>
                            </article>
                        )}
                    </div>
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
