import { memo } from "react";
import { Link } from "react-router-dom";
import type { BlogPostMeta } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendar, faTag } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

interface BlogCardProps {
    post: BlogPostMeta;
}

export const BlogCard = memo(function BlogCard({ post }: BlogCardProps) {
    const { t, i18n } = useTranslation();

    return (
        <Link
            to={`/blogs/${post.id}`}
            className="group relative block overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-card transition-colors duration-200 hover:border-accent"
        >
            <div className="absolute left-0 top-0 h-full w-0.5 bg-border transition-colors duration-200 group-hover:bg-accent" />

            <article className="relative flex h-full flex-col">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="flex-1 font-mono text-lg font-semibold leading-tight tracking-tight text-text-primary transition-colors duration-200 group-hover:text-accent">
                        {post.title}
                    </h3>
                </div>

                <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-text-secondary">
                    {post.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4 font-mono text-xs text-text-muted">
                    <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCalendar} className="h-3 w-3" aria-hidden="true" />
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString(i18n.language)}</time>
                    </span>

                    {post.readingTime && (
                        <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faClock} className="h-3 w-3" aria-hidden="true" />
                            <span>{`${post.readingTime} ${t("blog.minRead")}`}</span>
                        </span>
                    )}

                    {post.tags && post.tags.length > 0 && (
                        <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faTag} className="h-3 w-3" aria-hidden="true" />
                            <span className="line-clamp-1">
                                {post.tags.slice(0, 2).join(", ")}
                                {post.tags.length > 2 ? ` +${post.tags.length - 2}` : ""}
                            </span>
                        </span>
                    )}
                </div>
            </article>
        </Link>
    );
});
