export interface BlogPost {
    id: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    cover?: string;
    published: boolean;
    highlight?: boolean;
    content?: string;
    readingTime?: number;
}

export interface BlogFrontmatter {
    title: string;
    description: string;
    date: string;
    tags: string[];
    cover?: string;
}
