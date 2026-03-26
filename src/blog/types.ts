export interface BlogPostMeta {
    id: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    cover?: string;
    readingTime: number;
}

export interface BlogIndexEntry {
    id: string;
    highlight?: boolean;
    langs: Record<string, BlogPostMeta>;
}

export interface BlogPost extends BlogPostMeta {
    content: string;
    highlight?: boolean;
}
