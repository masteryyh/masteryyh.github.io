import { useState, useEffect } from "react";
import type { BlogIndexEntry, BlogPostMeta, BlogPost } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");
const BLOGS_BASE = `${BASE}/assets/blogs`;

let indexCache: Promise<BlogIndexEntry[]> | null = null;

export function fetchBlogIndex(): Promise<BlogIndexEntry[]> {
    if (!indexCache) {
        indexCache = fetch(`${BLOGS_BASE}/index.json`)
            .then((r) => {
                if (!r.ok) throw new Error(`Failed to fetch blog index: ${r.status}`);
                return r.json() as Promise<BlogIndexEntry[]>;
            })
            .catch((err) => {
                indexCache = null;
                throw err;
            });
    }
    return indexCache;
}

export function invalidateBlogIndexCache() {
    indexCache = null;
}

const contentCache = new Map<string, Promise<string>>();

function fetchBlogContent(id: string, lang: string): Promise<string> {
    const key = `${id}/${lang}`;
    const cached = contentCache.get(key);
    if (cached) return cached;

    const promise = fetch(`${BLOGS_BASE}/${id}/${lang}.md`)
        .then((r) => {
            if (!r.ok) throw new Error(`Failed to fetch post: ${id}/${lang}`);
            return r.text();
        })
        .catch((err) => {
            contentCache.delete(key);
            throw err;
        });

    contentCache.set(key, promise);
    return promise;
}

function resolvePostMeta(entry: BlogIndexEntry, lang: string): BlogPostMeta | null {
    const variant = entry.langs[lang] ?? entry.langs["en"];
    if (!variant) return null;

    return {
        id: entry.id,
        title: variant.title,
        description: variant.description,
        date: variant.date,
        tags: variant.tags,
        cover: variant.cover,
        readingTime: variant.readingTime,
    };
}

function resolveLang(entry: BlogIndexEntry, lang: string): string | null {
    if (entry.langs[lang]) return lang;
    if (entry.langs["en"]) return "en";
    return null;
}

// --- React Hooks ---

export function useBlogList(lang: string) {
    const [posts, setPosts] = useState<BlogPostMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchBlogIndex()
            .then((entries) => {
                if (cancelled) return;
                const resolved = entries
                    .map((e) => resolvePostMeta(e, lang))
                    .filter((p): p is BlogPostMeta => p !== null);
                resolved.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setPosts(resolved);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : String(err));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [lang]);

    return { posts, loading, error };
}

export function useBlogHighlights(lang: string, limit: number = 3) {
    const [posts, setPosts] = useState<BlogPostMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchBlogIndex()
            .then((entries) => {
                if (cancelled) return;
                const all: (BlogPostMeta & { highlight?: boolean })[] = [];
                for (const e of entries) {
                    const meta = resolvePostMeta(e, lang);
                    if (meta) all.push({ ...meta, highlight: e.highlight });
                }
                all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                const highlighted = all.filter((p) => p.highlight);
                const result = highlighted.length > 0 ? highlighted.slice(0, limit) : all.slice(0, limit);
                setPosts(result);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : String(err));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [lang, limit]);

    return { posts, loading, error };
}

export function useBlogPost(id: string | undefined, lang: string) {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setPost(null);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchBlogIndex()
            .then(async (entries) => {
                if (cancelled) return;

                const entry = entries.find((e) => e.id === id);
                if (!entry) {
                    setPost(null);
                    setLoading(false);
                    return;
                }

                const meta = resolvePostMeta(entry, lang);
                if (!meta) {
                    setPost(null);
                    setLoading(false);
                    return;
                }

                const resolvedLang = resolveLang(entry, lang);
                if (!resolvedLang) {
                    setPost(null);
                    setLoading(false);
                    return;
                }

                const content = await fetchBlogContent(id, resolvedLang);
                if (cancelled) return;

                setPost({
                    ...meta,
                    content,
                    highlight: entry.highlight,
                });
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err instanceof Error ? err.message : String(err));
                setLoading(false);
            });

        return () => { cancelled = true; };
    }, [id, lang]);

    return { post, loading, error };
}
