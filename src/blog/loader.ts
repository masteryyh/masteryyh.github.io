import type { BlogPost, BlogFrontmatter } from "./types";
import { BLOG_POSTS } from "./generated/posts";
import { loadBlogIndex } from "../utils/api";

type GeneratedPost = {
    frontmatter: BlogFrontmatter;
    content: string;
};

type GeneratedEntry = Partial<Record<string, GeneratedPost>> & {
    en?: GeneratedPost;
};

function estimateReadingTimeMinutes(content: string): number {
    return Math.max(1, Math.ceil(content.length / 400));
}

export async function loadBlogPost(
    id: string,
    lang: string,
) {
    try {
        const entry = (BLOG_POSTS as unknown as Record<string, GeneratedEntry>)[id];
        if (!entry) {
            return null;
        }

        const selected = entry[lang] ?? entry.en;
        if (!selected) {
            return null;
        }

        const { frontmatter, content } = selected;
        const readingTime = estimateReadingTimeMinutes(content);

        return {
            id,
            title: frontmatter.title,
            description: frontmatter.description,
            date: frontmatter.date,
            tags: frontmatter.tags || [],
            cover: frontmatter.cover,
            published: true,
            content,
            readingTime,
        } as BlogPost;
    } catch (error) {
        console.error("Error loading blog post", id, error);
        return null;
    }
}

export async function loadAllBlogPosts(
    lang: string,
) {
    const index = await loadBlogIndex();
    const posts = await Promise.all(
        index.posts
            .filter((meta) => meta.published)
            .map((meta) => loadBlogPost(meta.id, lang)),
    );

    return posts
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as BlogPost[];
}

export async function loadHighlightedPosts(
    lang: string,
    limit: number = 3,
): Promise<BlogPost[]> {
    const index = await loadBlogIndex();
    const highlightedMeta = index.posts
        .filter((meta) => meta.published && meta.highlight)
        .slice(0, limit);

    if (highlightedMeta.length === 0) {
        const allPosts = await loadAllBlogPosts(lang);
        return allPosts.slice(0, limit);
    }

    const posts = await Promise.all(
        highlightedMeta.map((meta) => loadBlogPost(meta.id, lang)),
    );

    return posts.filter((post): post is BlogPost => post !== null);
}
