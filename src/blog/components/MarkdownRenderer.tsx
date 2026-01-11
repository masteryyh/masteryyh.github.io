import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import "./highlight.css";

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-h1:text-3xl prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-xl prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-strong:font-semibold prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-pre:border prose-pre:border-slate-700 prose-pre:shadow-lg prose-pre:overflow-x-auto prose-ul:list-disc prose-ul:text-slate-700 dark:prose-ul:text-slate-300 prose-ol:list-decimal prose-ol:text-slate-700 dark:prose-ol:text-slate-300 prose-li:marker:text-slate-500 dark:prose-li:marker:text-slate-400 prose-blockquote:border-l-blue-600 dark:prose-blockquote:border-l-blue-400 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300 prose-hr:border-slate-200 dark:prose-hr:border-slate-800">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkFrontmatter]}
                rehypePlugins={[
                    rehypeHighlight,
                    rehypeSlug,
                    [
                        rehypeAutolinkHeadings,
                        {
                            behavior: "wrap",
                            properties: {
                                className: ["anchor"],
                            },
                        },
                    ],
                ]}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
