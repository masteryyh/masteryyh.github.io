import { useEffect, useMemo } from "react";
import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { useBlogPost } from "./loader";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendar, faClock, faTag } from "@fortawesome/free-solid-svg-icons";
import { PROFILE } from "../consts/consts";
import { SEO } from "../components/SEO";
import { PageLayout } from "../components/PageLayout";
import { BlogPostSkeleton } from "../components/Skeleton";

export function BlogPostPage() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();

    const activePath = useMemo(() => {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/+$/, "");
        const raw = location.pathname;
        const stripped = baseUrl && raw.startsWith(baseUrl) ? raw.slice(baseUrl.length) : raw;
        return stripped || "/";
    }, [location.pathname]);

    if (!id) {
        return <Navigate to="/blogs" replace />;
    }

    return (
        <PageLayout activePath={activePath} basePath="~/portfolio">
            {({ t, lang }) => (
                <BlogPostContent id={id} lang={lang} t={t} />
            )}
        </PageLayout>
    );
}

function BlogPostContent({
    id,
    lang,
    t,
}: {
    id: string;
    lang: string;
    t: (key: string) => string;
}) {
    const { post, loading, error } = useBlogPost(id, lang);

    useEffect(() => {
        document.title = post?.title
            ? `${post.title} • masteryyh's home`
            : `${t("blog.title")} • masteryyh's home`;
    }, [post?.title, t]);

    return (
        <>
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

            <header className="mb-10">
                <Link
                    to="/blogs"
                    className="group mb-8 inline-flex w-fit items-center gap-2 font-mono text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
                >
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                    />
                    <span>{t("blog.backToBlog")}</span>
                </Link>
            </header>

            <main className="mx-auto w-full max-w-4xl">
                {loading ? (
                    <BlogPostSkeleton />
                ) : error ? (
                    <div className="overflow-hidden rounded-lg border border-warn bg-warn-muted p-8">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="font-mono text-sm text-warn">
                                {"// "}{error}
                            </div>
                        </div>
                    </div>
                ) : !post ? (
                    <div className="overflow-hidden rounded-lg border border-warn bg-warn-muted p-8">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="font-mono text-sm text-warn">
                                {"// "}{t("blog.postNotFound")}
                            </div>
                        </div>
                    </div>
                ) : (
                    <article>
                        <header className="mb-10">
                            <h2 className="mb-4 font-mono text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl">
                                {post.title}
                            </h2>

                            <p className="mb-6 text-base leading-relaxed text-text-secondary sm:text-lg">
                                {post.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 border-b border-border pb-6 font-mono text-sm text-text-muted">
                                <span className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
                                    {new Date(post.date).toLocaleDateString(lang)}
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

                        <MarkdownRenderer content={post.content} />

                        <footer className="mt-12 border-t border-border pt-8">
                            <Link
                                to="/blogs"
                                className="inline-flex items-center gap-2 font-mono text-sm text-info transition-colors duration-200 hover:text-info-hover hover:underline"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
                                {t("blog.backToBlog")}
                            </Link>
                        </footer>
                    </article>
                )}
            </main>
        </>
    );
}
