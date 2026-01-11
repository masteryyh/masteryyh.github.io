import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { BlogPost } from "../types";
import { loadHighlightedPosts } from "../loader";
import { BlogCard } from "./BlogCard";
import { Section } from "../../components/Section";

export function BlogSection() {
    const { t, i18n } = useTranslation();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const lang = i18n.language === "zh-CN" ? "zh-CN" : "en";

        void (async () => {
            try {
                setLoading(true);
                setError(null);
                const highlightedPosts = await loadHighlightedPosts(lang, 3);
                setPosts(highlightedPosts);
            } catch (e) {
                console.error("Failed to load blog posts:", e);
                setError(e instanceof Error ? e : new Error(String(e)));
            } finally {
                setLoading(false);
            }
        })();
    }, [i18n.language]);

    return (
        <Section title={t("blog.title")}>
            {loading ? (
                <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
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
                <>
                    <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            to="/blogs"
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:border-blue-700 hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:border-blue-600 dark:hover:bg-blue-600"
                        >
                            {t("blog.viewAll")}
                            <span>→</span>
                        </Link>
                    </div>
                </>
            )}
        </Section>
    );
}
