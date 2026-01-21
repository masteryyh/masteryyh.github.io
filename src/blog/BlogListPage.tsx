import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "./types";
import { loadAllBlogPosts } from "./loader";
import { BlogCard } from "./components/BlogCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import type { Lang } from "../i18n";
import { HeaderBar } from "../components/HeaderBar";
import { SocialButtons } from "../components/SocialButtons";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { GitHubAvatarButton } from "../components/GitHubAvatarButton";
import { PROFILE } from "../consts/consts";
import { useI18nLoader } from "../hooks/useI18nLoader";
import { useLanguageSwitcher } from "../hooks/useLanguageSwitcher";
import { useScrollState } from "../hooks/useScrollState";
import { BlogCardSkeleton } from "../components/Skeleton";

export function BlogListPage() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const lang: Lang = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";

    const { i18nError, i18nReady, handleRetry } = useI18nLoader(i18n.language);
    const { languageSwitching, handleLangChange } = useLanguageSwitcher(i18n, lang);
    const scrolled = useScrollState(8);

    const activePath = useMemo(() => {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/+$/, "");
        const raw = location.pathname;
        const stripped = baseUrl && raw.startsWith(baseUrl) ? raw.slice(baseUrl.length) : raw;
        return stripped || "/";
    }, [location.pathname]);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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

                <main className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:px-5">
                    <div className="mb-8">
                        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </div>

                    <header className="mb-10 space-y-3">
                        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                        <div className="h-5 w-96 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    </header>

                    <div className="grid gap-6">
                        {[...Array(3)].map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                </main>
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
                <header className="mb-12 flex flex-col gap-8">
                    <Link
                        to="/"
                        className="group inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                            aria-hidden="true"
                        />
                        <span>{t("blog.backToHome")}</span>
                    </Link>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <span
                                        aria-hidden="true"
                                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_0_4px_rgba(16,185,129,0.15),0_0_12px_rgba(16,185,129,0.3)] dark:from-emerald-500 dark:to-cyan-500 dark:shadow-[0_0_0_4px_rgba(16,185,129,0.2),0_0_16px_rgba(16,185,129,0.4)]"
                                    />
                                    <h1 className="break-words bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-slate-50 dark:to-slate-300 sm:text-4xl">
                                        {t("blog.title")}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-2 pl-6">
                                    <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                                        ~/blogs
                                    </span>
                                    {posts.length > 0 && (
                                        <>
                                            <span
                                                className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-600"
                                                aria-hidden="true"
                                            />
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {t("blog.postCount", { count: posts.length })}
                                            </span>
                                        </>
                                    )}
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
                            {t("blog.subtitle")}
                        </p>
                    </div>
                </header>

                <main>
                    {loading ? (
                        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <BlogCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="overflow-hidden rounded-xl border border-red-200/60 bg-gradient-to-br from-red-50 to-rose-50/30 p-6 shadow-soft dark:border-red-900/40 dark:from-red-950/30 dark:to-rose-950/20">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                                    <svg
                                        className="h-4 w-4 text-red-600 dark:text-red-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="font-semibold text-red-700 dark:text-red-300">
                                        {t("blog.errorLoading")}
                                    </div>
                                    <div className="text-sm text-red-600/90 dark:text-red-400/80">{error.message}</div>
                                </div>
                            </div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white p-12 text-center shadow-soft dark:border-slate-800/40 dark:bg-slate-900/90">
                            <div className="mx-auto max-w-sm space-y-4">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-850">
                                    <svg
                                        className="h-8 w-8 text-slate-400 dark:text-slate-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-medium text-slate-900 dark:text-slate-100">
                                        {t("blog.noPosts")}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {t("blog.checkBackSoon")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                            {posts.map((post, index) => (
                                <div
                                    key={post.id}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                    }}
                                    className="animate-fade-in-up"
                                >
                                    <BlogCard post={post} />
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                <footer className="mt-16 border-t border-slate-200 py-6 text-xs text-slate-600 dark:border-slate-800/70 dark:text-slate-400 sm:py-8 sm:text-sm">
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
