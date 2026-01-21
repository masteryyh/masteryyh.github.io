import { Link } from "react-router-dom";
import type { BlogPost } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendar, faTag } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    const { t } = useTranslation();

    return (
        <Link
            to={`/blogs/${post.id}`}
            className="group relative block overflow-hidden rounded-xl border border-slate-200/60 bg-white p-6 shadow-soft transition-all duration-300 hover:border-emerald-400/50 hover:shadow-soft-lg hover:-translate-y-1 dark:border-slate-800/40 dark:bg-slate-900/90 dark:hover:border-emerald-500/40"
        >
            {/* Gradient overlay on hover */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: "radial-gradient(circle at top left, rgba(16, 185, 129, 0.05), transparent 70%)",
                }}
            />

            {/* Accent line */}
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <article className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="flex-1 text-xl font-semibold leading-tight tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-emerald-600 dark:text-slate-50 dark:group-hover:text-emerald-400">
                        {post.title}
                    </h3>

                    {/* Hover indicator */}
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 opacity-0 transition-all duration-200 group-hover:opacity-100 dark:bg-slate-800">
                        <svg
                            className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {post.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800/60 dark:text-slate-500 sm:text-sm">
                    <span className="flex items-center gap-1.5 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        <FontAwesomeIcon icon={faCalendar} className="h-3.5 w-3.5" aria-hidden="true" />
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                    </span>

                    {post.readingTime && (
                        <span className="flex items-center gap-1.5 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>{`${post.readingTime} ${t("blog.minRead")}`}</span>
                        </span>
                    )}

                    {post.tags && post.tags.length > 0 && (
                        <span className="flex items-center gap-1.5 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            <FontAwesomeIcon icon={faTag} className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="line-clamp-1">{post.tags.slice(0, 2).join(", ")}</span>
                        </span>
                    )}
                </div>
            </article>
        </Link>
    );
}
