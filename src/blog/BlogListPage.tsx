import { useEffect, useMemo } from "react";
import { useBlogList } from "./loader";
import { BlogCard } from "./components/BlogCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { SocialButtons } from "../components/SocialButtons";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { GitHubAvatarButton } from "../components/GitHubAvatarButton";
import { PROFILE } from "../consts/consts";
import { BlogCardSkeleton } from "../components/Skeleton";
import { PageLayout } from "../components/PageLayout";
import type { Lang } from "../i18n/i18n.config";

function BlogListSkeleton() {
    return (
        <main className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:px-5">
            <div className="mb-8">
                <div className="h-5 w-32 bg-border rounded animate-pulse" />
            </div>

            <header className="mb-10 space-y-3">
                <div className="h-10 w-48 bg-border rounded animate-pulse" />
                <div className="h-5 w-96 bg-border rounded animate-pulse" />
            </header>

            <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                    <BlogCardSkeleton key={i} />
                ))}
            </div>
        </main>
    );
}

export function BlogListPage() {
    const location = useLocation();

    const activePath = useMemo(() => {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/+$/, "");
        const raw = location.pathname;
        const stripped = baseUrl && raw.startsWith(baseUrl) ? raw.slice(baseUrl.length) : raw;
        return stripped || "/";
    }, [location.pathname]);

    return (
        <PageLayout activePath={activePath} basePath="~/portfolio" loadingFallback={<BlogListSkeleton />}>
            {({ t, lang, scrolled, handleLangChange, languageSwitching }) => (
                <BlogListContent
                    t={t}
                    lang={lang}
                    scrolled={scrolled}
                    handleLangChange={handleLangChange}
                    languageSwitching={languageSwitching}
                />
            )}
        </PageLayout>
    );
}

function BlogListContent({
    t,
    lang,
    scrolled,
    handleLangChange,
    languageSwitching,
}: {
    t: (key: string, opts?: Record<string, unknown>) => string;
    lang: string;
    scrolled: boolean;
    handleLangChange: (lang: Lang) => void;
    languageSwitching: boolean;
}) {
    const { posts, loading, error } = useBlogList(lang);

    useEffect(() => {
        document.title = `${t("blog.title")} • masteryyh's home`;
    }, [lang, t]);

    return (
        <>
            <header className="mb-12 flex flex-col gap-8">
                <Link
                    to="/"
                    className="group inline-flex w-fit items-center gap-2 font-mono text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
                >
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                    />
                    <span>{t("blog.backToHome")}</span>
                </Link>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-col gap-3">
                            <h1 className="break-words font-mono text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                                {t("blog.title")}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-accent">
                                    ~/blogs
                                </span>
                                {!loading && posts.length > 0 && (
                                    <>
                                        <span
                                            className="h-1 w-1 rounded-full bg-text-muted"
                                            aria-hidden="true"
                                        />
                                        <span className="font-mono text-xs text-text-muted">
                                            {t("blog.postCount", { count: posts.length })}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {!scrolled ? (
                            <div className="hidden items-center gap-2 sm:flex">
                                <SocialButtons linkedInUrl={PROFILE.contact.linkedin} className="flex" lang={lang} />
                                <ThemeToggle />
                                <div className="hidden sm:block">
                                    <LanguageToggle
                                        value={lang as Lang}
                                        onChange={handleLangChange}
                                        disabled={languageSwitching}
                                    />
                                </div>
                                <GitHubAvatarButton />
                            </div>
                        ) : null}
                    </div>

                    <p className="max-w-2xl text-balance text-sm leading-relaxed text-text-secondary sm:text-base">
                        {t("blog.subtitle")}
                    </p>
                </div>
            </header>

            <main>
                {loading ? (
                    <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-warn bg-warn-muted p-8 text-center">
                        <p className="font-mono text-sm text-warn">{"// "}{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="overflow-hidden rounded-lg border border-border bg-surface p-12 text-center shadow-card">
                        <div className="mx-auto max-w-sm space-y-4">
                            <p className="font-mono text-sm text-text-muted">
                                {"// "}{t("blog.noPosts")}
                            </p>
                            <p className="font-mono text-xs text-text-muted">
                                {t("blog.checkBackSoon")}
                            </p>
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
        </>
    );
}
