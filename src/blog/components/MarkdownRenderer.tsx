import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { isValidElement, useEffect, useMemo, useState, type ReactNode } from "react";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import "./highlight.css";

interface MarkdownRendererProps {
    content: string;
}

function extractLanguage(className?: string): string {
    if (!className) return "text";
    const m = className.match(/\blanguage-([\w-]+)\b/);
    return m?.[1] ?? "text";
}

function extractText(node: unknown): string {
    if (node == null) return "";
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).join("");

    // react-markdown sometimes nests children; try to pull `props.children`.
    if (isValidElement<{ children?: ReactNode }>(node)) {
        return extractText(node.props.children);
    }
    return "";
}

async function copyToClipboard(text: string): Promise<void> {
    if (typeof navigator === "undefined") return;
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

type PreProps = React.ComponentPropsWithoutRef<"pre"> & {
    children?: ReactNode;
};

function PreBlock({ children, ...props }: PreProps) {
    const codeElement = useMemo(() => {
        // In fenced blocks, <pre> contains a single <code> element.
        return Array.isArray(children) ? children[0] : children;
    }, [children]);

    const language = useMemo(() => {
        if (isValidElement<{ className?: string }>(codeElement)) {
            return extractLanguage(codeElement.props.className);
        }
        return "text";
    }, [codeElement]);

    const codeText = useMemo(() => extractText(codeElement), [codeElement]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const t = window.setTimeout(() => setCopied(false), 1200);
        return () => window.clearTimeout(t);
    }, [copied]);

    return (
        <div className="md-codeblock not-prose">
            <div className="md-codeblock-shell">
                <div className="md-codeblock-header">
                    <div className="md-codeblock-traffic" aria-hidden="true">
                        <span className="md-dot md-dot-close" />
                        <span className="md-dot md-dot-min" />
                        <span className="md-dot md-dot-max" />
                    </div>

                    <div className="md-codeblock-title" title={language}>
                        {language}
                    </div>

                    <div className="md-codeblock-actions">
                        {copied ? <span className="md-codeblock-copied">Copied</span> : null}
                        <button
                            type="button"
                            className="md-copy-button"
                            onClick={() => {
                                void copyToClipboard(codeText).then(() => setCopied(true));
                            }}
                            aria-label="Copy code"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                <pre className="md-pre" {...props}>
                    {children}
                </pre>
            </div>
        </div>
    );
}

const markdownComponents: Components = {
    pre: PreBlock,
    code: ({ className, children, ...props }) => {
        // react-markdown passes inline code without a surrounding <pre>.
        // For fenced code blocks, <code> is rendered inside our custom <pre> above.
        const isBlock = typeof className === "string" && /\blanguage-/.test(className);
        const combinedClassName = [
            isBlock ? "md-code hljs" : "md-inline-code",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <code className={combinedClassName} {...props}>
                {children}
            </code>
        );
    },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <article className="markdown-article">
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
                components={markdownComponents}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
