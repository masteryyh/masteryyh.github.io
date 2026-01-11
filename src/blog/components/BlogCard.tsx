import { Link } from "react-router-dom";
import type { BlogPost } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendar, faTag } from "@fortawesome/free-solid-svg-icons";

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link
            to={`/blogs/${post.id}`}
            className="group block rounded-lg border border-slate-200 bg-white p-5 transition-all hover:border-blue-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500 sm:p-6"
        >
            <article>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                    {post.title}
                </h3>

                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                    {post.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-500 sm:gap-4 sm:text-sm">
                    <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCalendar} className="h-3.5 w-3.5" />
                        {new Date(post.date).toLocaleDateString()}
                    </span>

                    {post.readingTime && (
                        <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
                            {post.readingTime} min read
                        </span>
                    )}

                    {post.tags && post.tags.length > 0 && (
                        <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faTag} className="h-3.5 w-3.5" />
                            {post.tags.slice(0, 2).join(", ")}
                        </span>
                    )}
                </div>
            </article>
        </Link>
    );
}
