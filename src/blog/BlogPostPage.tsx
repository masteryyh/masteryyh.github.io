import { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "./types";
import { loadBlogPost } from "./loader";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendar, faClock, faTag } from "@fortawesome/free-solid-svg-icons";
import type { Lang } from "../i18n";
import { HeaderBar } from "../components/HeaderBar";
import { PROFILE } from "../consts/consts";
import { useI18nLoader } from "../hooks/useI18nLoader";
import { useLanguageSwitcher } from "../hooks/useLanguageSwitcher";
import { useScrollState } from "../hooks/useScrollState";
import { SEO } from "../components/SEO";
import { BlogPostSkeleton } from "../components/Skeleton";

export function BlogPostPage() {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const lang: Lang = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";

    // Use custom hooks to reduce code duplication
    const { i18nError, i18nReady, handleRetry } = useI18nLoader(i18n.language);
    const { languageSwitching, handleLangChange } = useLanguageSwitcher(i18n, lang);
    const scrolled = useScrollState(8);

    const activePath = useMemo(() => {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/+$/, "");
        const raw = location.pathname;
        const stripped = baseUrl && raw.startsWith(baseUrl) ? raw.slice(baseUrl.length) : raw;
        return stripped || "/";
    }, [location.pathname]);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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
            {post ? (
                <SEO
                    title={`${post.title} • masteryyh's home`}
                    description={post.description}
                    image={post.cover}
                    type="article"
                    author={PROFILE.name}
                    publishedTime={post.date}
                    tags={post.tags}
                />
            ) : null}

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
                <header className="mb-10">
                    <Link
                        to="/blogs"
                        className="group mb-8 inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                            aria-hidden="true"
                        />
                        <span>{t("blog.backToBlog")}</span>
                    </Link>
                </header>

                <main className="mx-auto w-full max-w-4xl">
                    {loading ? (
                        <BlogPostSkeleton />
                    ) : error || !post ? (
                        <div className="overflow-hidden rounded-xl border border-red-200/60 bg-gradient-to-br from-red-50 to-rose-50/30 p-8 shadow-soft dark:border-red-900/40 dark:from-red-950/30 dark:to-rose-950/20">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                                    <svg
                                        className="h-6 w-6 text-red-600 dark:text-red-400"
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
                                <div className="space-y-2">
                                    <div className="font-semibold text-red-700 dark:text-red-300">
                                        {error ? t("blog.errorLoadingPost") : t("blog.postNotFound")}
                                    </div>
                                    {error && (
                                        <div className="text-sm text-red-600/90 dark:text-red-400/80">
                                            {error.message}
                                        </div>
                                    )}
                                </div>
                            </div>
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
