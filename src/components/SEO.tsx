import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article";
    author?: string;
    publishedTime?: string;
    tags?: string[];
}

export function SEO({ title, description, image, type = "website", author, publishedTime, tags }: SEOProps) {
    const location = useLocation();
    const baseUrl = import.meta.env.VITE_BASE_URL || "https://me.masteryyh.win";
    const currentUrl = `${baseUrl}${location.pathname}`;

    useEffect(() => {
        if (title) {
            document.title = title;
        }

        if (description) {
            updateMetaTag("name", "description", description);
        }

        // Open Graph tags
        updateMetaTag("property", "og:url", currentUrl);
        updateMetaTag("property", "og:type", type);
        if (title) updateMetaTag("property", "og:title", title);
        if (description) updateMetaTag("property", "og:description", description);
        if (image) updateMetaTag("property", "og:image", image);

        // Twitter Card tags
        updateMetaTag("name", "twitter:card", image ? "summary_large_image" : "summary");
        if (title) updateMetaTag("name", "twitter:title", title);
        if (description) updateMetaTag("name", "twitter:description", description);
        if (image) updateMetaTag("name", "twitter:image", image);

        // Article-specific tags
        if (type === "article") {
            if (author) updateMetaTag("property", "article:author", author);
            if (publishedTime) updateMetaTag("property", "article:published_time", publishedTime);
            if (tags) {
                // Remove existing tags first
                document.querySelectorAll('meta[property="article:tag"]').forEach((el) => el.remove());
                // Add new tags
                tags.forEach((tag) => {
                    const meta = document.createElement("meta");
                    meta.setAttribute("property", "article:tag");
                    meta.content = tag;
                    document.head.appendChild(meta);
                });
            }
        }

        // Structured data for articles
        if (type === "article" && title && description) {
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: title,
                description: description,
                url: currentUrl,
                ...(author && { author: { "@type": "Person", name: author } }),
                ...(publishedTime && { datePublished: publishedTime }),
                ...(image && { image: image }),
                ...(tags && { keywords: tags.join(", ") }),
            };

            updateStructuredData("blog-post-schema", structuredData);
        }

        // Cleanup function
        return () => {
            // Remove article tags when unmounting
            if (type === "article") {
                document.querySelectorAll('meta[property^="article:"]').forEach((el) => el.remove());
                removeStructuredData("blog-post-schema");
            }
        };
    }, [title, description, image, type, author, publishedTime, tags, currentUrl]);

    return null; // This component doesn't render anything
}

function updateMetaTag(attr: string, key: string, content: string) {
    let element = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;

    if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, key);
        document.head.appendChild(element);
    }

    element.content = content;
}

function updateStructuredData(id: string, data: Record<string, unknown>) {
    let script = document.getElementById(id) as HTMLScriptElement;

    if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);
}

function removeStructuredData(id: string) {
    const script = document.getElementById(id);
    if (script) {
        script.remove();
    }
}
