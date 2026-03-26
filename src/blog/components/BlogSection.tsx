import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useBlogHighlights } from "../loader";
import { BlogCard } from "./BlogCard";
import { Section } from "../../components/Section";

export function BlogSection() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language === "zh-CN" ? "zh-CN" : "en";
    const { posts, loading, error } = useBlogHighlights(lang, 3);

    return (
        <Section title={t("blog.title")}>
            {loading ? (
                <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-40 animate-pulse rounded-lg border border-border bg-surface" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-lg border border-warn bg-warn-muted p-6 text-center font-mono text-sm text-warn">
                    {"// "}{error}
                </div>
            ) : posts.length === 0 ? (
                <div className="rounded-lg border border-border bg-surface p-8 text-center font-mono text-sm text-text-muted">
                    {"// "}{t("blog.noPosts")}
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
                            className="inline-flex items-center gap-2 rounded border border-accent px-6 py-2.5 font-mono text-sm font-medium text-accent transition-colors duration-200 hover:bg-accent-muted"
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
