import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Plugin, ViteDevServer } from "vite";

interface GeneratedPost {
    id: string;
    lang: string;
    frontmatter: Record<string, unknown>;
    content: string;
}

type BlogIndexEntry = {
    id: string;
    date: string;
    published: boolean;
    highlight?: boolean;
};

type BlogIndexJson = {
    posts: BlogIndexEntry[];
};

function isValidDate(d: Date): boolean {
    return Number.isFinite(d.getTime());
}

function normalizeFrontmatterDateToIso(value: unknown): string | null {
    // Rules:
    // - If only YYYY-MM-DD is provided, default to 12:00 (noon).
    // - Output ISO string in UTC to keep builds deterministic across machines.
    // - Accept Date objects (js-yaml may parse YYYY-MM-DD into Date).
    if (typeof value === "string") {
        const s = value.trim();

        const mDateOnly = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (mDateOnly) {
            const y = Number(mDateOnly[1]);
            const mo = Number(mDateOnly[2]);
            const d = Number(mDateOnly[3]);
            return new Date(Date.UTC(y, mo - 1, d, 12, 0, 0, 0)).toISOString();
        }

        const mDateTimeNoTz = s.match(
            /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?$/,
        );
        if (mDateTimeNoTz) {
            const y = Number(mDateTimeNoTz[1]);
            const mo = Number(mDateTimeNoTz[2]);
            const d = Number(mDateTimeNoTz[3]);
            const hh = Number(mDateTimeNoTz[4]);
            const mm = Number(mDateTimeNoTz[5]);
            const ss = mDateTimeNoTz[6] ? Number(mDateTimeNoTz[6]) : 0;
            return new Date(Date.UTC(y, mo - 1, d, hh, mm, ss, 0)).toISOString();
        }

        const parsed = new Date(s);
        return isValidDate(parsed) ? parsed.toISOString() : null;
    }

    if (value instanceof Date) {
        if (!isValidDate(value)) return null;

        // If it's exactly midnight UTC, treat it like a date-only value and default to noon.
        if (
            value.getUTCHours() === 0 &&
            value.getUTCMinutes() === 0 &&
            value.getUTCSeconds() === 0 &&
            value.getUTCMilliseconds() === 0
        ) {
            return new Date(
                Date.UTC(
                    value.getUTCFullYear(),
                    value.getUTCMonth(),
                    value.getUTCDate(),
                    12,
                    0,
                    0,
                    0,
                ),
            ).toISOString();
        }

        return value.toISOString();
    }

    return null;
}

async function getFileFallbackDateIso(filePath: string): Promise<string> {
    const stat = await fs.stat(filePath);
    const ms = stat.birthtimeMs || stat.ctimeMs || stat.mtimeMs;
    return new Date(ms).toISOString();
}

function escapeTsString(value: string) {
    return value
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\${/g, "\\${");
}

async function fileExists(p: string) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function readTextIfExists(p: string) {
    try {
        return await fs.readFile(p, "utf8");
    } catch {
        return null;
    }
}

async function writeTextIfChanged(filePath: string, next: string) {
    const prev = await readTextIfExists(filePath);
    if (prev === next) {
        return false;
    }
    await fs.writeFile(filePath, next, "utf8");
    return true;
}

async function readBufferIfExists(p: string) {
    try {
        return await fs.readFile(p);
    } catch {
        return null;
    }
}

async function writeBufferIfChanged(filePath: string, next: Buffer) {
    const prev = await readBufferIfExists(filePath);
    if (prev && Buffer.compare(prev, next) === 0) {
        return false;
    }
    await fs.writeFile(filePath, next);
    return true;
}

function toPosixRelativePath(p: string) {
    return p.split(path.sep).join("/");
}

async function listFilesRecursive(dir: string) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const d of dirents) {
        const full = path.join(dir, d.name);
        if (d.isDirectory()) {
            files.push(...(await listFilesRecursive(full)));
        } else if (d.isFile()) {
            files.push(full);
        }
    }

    return files;
}

async function removeEmptyDirsRecursive(dir: string) {
    let dirents: Array<import("node:fs").Dirent>;
    try {
        dirents = await fs.readdir(dir, { withFileTypes: true });
    } catch {
        return;
    }

    await Promise.all(
        dirents
            .filter((d) => d.isDirectory())
            .map((d) => removeEmptyDirsRecursive(path.join(dir, d.name))),
    );

    try {
        const after = await fs.readdir(dir);
        if (after.length === 0) {
            await fs.rmdir(dir);
        }
    } catch {
        // ignore
    }
}

async function generateBlogPostsModule(projectRoot: string) {
    const blogsDir = path.join(projectRoot, "blogs");
    const outDir = path.join(projectRoot, "src", "blog", "generated");
    const outFile = path.join(outDir, "posts.ts");

    await fs.mkdir(outDir, { recursive: true });

    const entries: GeneratedPost[] = [];

    if (!(await fileExists(blogsDir))) {
        const empty = `// AUTO-GENERATED by vite-plugin-blog-posts. Do not edit.
export const BLOG_POSTS = {} as const;
export type BlogPostId = keyof typeof BLOG_POSTS;
`;
        return await writeTextIfChanged(outFile, empty);
    }

    const dirents = await fs.readdir(blogsDir, { withFileTypes: true });
    for (const d of dirents) {
        if (!d.isDirectory()) continue;
        const id = d.name;
        const postDir = path.join(blogsDir, id);
        const files = await fs.readdir(postDir);
        for (const file of files) {
            if (!file.endsWith(".md")) continue;
            const lang = file.replace(/\.md$/, "");
            const fullPath = path.join(postDir, file);
            const raw = await fs.readFile(fullPath, "utf8");
            const parsed = matter(raw);

            const data = (typeof parsed.data === "object" && parsed.data ? parsed.data : {}) as Record<
                string,
                unknown
            >;

            const fallbackIso = await getFileFallbackDateIso(fullPath);
            const dateIso = normalizeFrontmatterDateToIso(data.date) ?? fallbackIso;

            const fm = {
                ...data,
                date: dateIso,
            } as Record<string, unknown>;

            entries.push({
                id,
                lang,
                frontmatter: fm,
                content: parsed.content ?? "",
            });
        }
    }

    entries.sort((a, b) => {
        if (a.id !== b.id) return a.id.localeCompare(b.id);
        return a.lang.localeCompare(b.lang);
    });

    const lines: string[] = [];
    lines.push("// AUTO-GENERATED by vite-plugin-blog-posts. Do not edit.");
    lines.push("// Source: /blogs/<id>/<lang>.md");
    lines.push("");
    lines.push(
        "export const BLOG_POSTS = {" +
            entries
                .map((e) => {
                    const fm = JSON.stringify(e.frontmatter);
                    const content = escapeTsString(e.content);
                    return `\n    ${JSON.stringify(e.id)}: {\n        ...(BLOG_POSTS?.[${JSON.stringify(
                        e.id,
                    )}] ?? {}),\n        ${JSON.stringify(e.lang)}: { frontmatter: ${fm}, content: \`${content}\` },\n    },`;
                })
                .join("") +
            "\n} as const;",
    );
    lines.push("");
    lines.push("export type BlogPostId = keyof typeof BLOG_POSTS;");
    lines.push("");

    // The above builder is a bit hacky; rewrite with a simple object merge pass for correctness.
    // We generate a second pass object literal to avoid relying on BLOG_POSTS during construction.
    const grouped = new Map<string, Record<string, { frontmatter: unknown; content: string }>>();
    for (const e of entries) {
        const g = grouped.get(e.id) ?? {};
        g[e.lang] = { frontmatter: e.frontmatter, content: e.content };
        grouped.set(e.id, g);
    }

    const objLiteral = Array.from(grouped.entries())
        .map(([id, langs]) => {
            const langEntries = Object.entries(langs)
                .map(([lang, v]) => {
                    const fm = JSON.stringify(v.frontmatter);
                    const content = escapeTsString(v.content);
                    return `\n        ${JSON.stringify(lang)}: { frontmatter: ${fm}, content: \`${content}\` },`;
                })
                .join("");
            return `\n    ${JSON.stringify(id)}: {${langEntries}\n    },`;
        })
        .join("");

    const content = `// AUTO-GENERATED by vite-plugin-blog-posts. Do not edit.
// Source: /blogs/<id>/<lang>.md

export const BLOG_POSTS = {${objLiteral}
} as const;

export type BlogPostId = keyof typeof BLOG_POSTS;
`;

    return await writeTextIfChanged(outFile, content);
}

function isIgnorableBlogFile(relPosix: string): boolean {
    const base = relPosix.split("/").pop() ?? relPosix;
    return base === ".DS_Store";
}

async function generateBlogIndexJson(projectRoot: string) {
    const sourceRoot = path.join(projectRoot, "blogs");
    const indexPath = path.join(sourceRoot, "index.json");

    if (!(await fileExists(sourceRoot))) {
        return false;
    }

    const dirents = await fs.readdir(sourceRoot, { withFileTypes: true });
    const posts: BlogIndexEntry[] = [];

    for (const d of dirents) {
        if (!d.isDirectory()) continue;
        const id = d.name;
        const postDir = path.join(sourceRoot, id);
        const files = await fs.readdir(postDir, { withFileTypes: true });
        const mdFiles = files
            .filter((f) => f.isFile() && f.name.endsWith(".md"))
            .map((f) => path.join(postDir, f.name));

        if (mdFiles.length === 0) continue;

        let published = true;
        let highlight = false;
        let publishMs = Number.POSITIVE_INFINITY;

        for (const fullPath of mdFiles) {
            const raw = await fs.readFile(fullPath, "utf8");
            const parsed = matter(raw);
            const data = (typeof parsed.data === "object" && parsed.data ? parsed.data : {}) as Record<
                string,
                unknown
            >;

            const fallbackIso = await getFileFallbackDateIso(fullPath);
            const iso = normalizeFrontmatterDateToIso(data.date) ?? fallbackIso;
            publishMs = Math.min(publishMs, new Date(iso).getTime());

            if (data.published === false) {
                published = false;
            }
            if (data.highlight === true) {
                highlight = true;
            }
        }

        if (!Number.isFinite(publishMs)) continue;

        const entry: BlogIndexEntry = {
            id,
            date: new Date(publishMs).toISOString(),
            published,
        };

        if (highlight) {
            entry.highlight = true;
        }

        posts.push(entry);
    }

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const json: BlogIndexJson = { posts };
    const next = `${JSON.stringify(json, null, 4)}\n`;
    return await writeTextIfChanged(indexPath, next);
}

async function syncBlogsToPublic(projectRoot: string): Promise<boolean> {
    const sourceRoot = path.join(projectRoot, "blogs");
    const publicRoot = path.join(projectRoot, "public", "blogs");

    if (!(await fileExists(sourceRoot))) {
        return false;
    }

    await fs.mkdir(publicRoot, { recursive: true });

    // Build expected file set (relative path -> absolute source file)
    const expected = new Map<string, string>();
    const allSourceFiles = await listFilesRecursive(sourceRoot);
    for (const abs of allSourceFiles) {
        const rel = toPosixRelativePath(path.relative(sourceRoot, abs));
        if (isIgnorableBlogFile(rel)) continue;
        expected.set(rel, abs);
    }

    // Copy/update expected files incrementally.
    let changed = false;
    for (const [rel, srcAbs] of expected.entries()) {
        const destAbs = path.join(publicRoot, rel);
        await fs.mkdir(path.dirname(destAbs), { recursive: true });
        const data = await fs.readFile(srcAbs);
        const wrote = await writeBufferIfChanged(destAbs, data);
        changed = changed || wrote;
    }

    // Remove stale files from public/blogs.
    if (await fileExists(publicRoot)) {
        const destFiles = await listFilesRecursive(publicRoot);
        for (const abs of destFiles) {
            const rel = toPosixRelativePath(path.relative(publicRoot, abs));
            if (!expected.has(rel)) {
                await fs.unlink(abs);
                changed = true;
            }
        }
        await removeEmptyDirsRecursive(publicRoot);
        // Recreate root folder if it was removed due to being empty.
        await fs.mkdir(publicRoot, { recursive: true });
    }

    return changed;
}

async function regenerate(projectRoot: string, server?: ViteDevServer) {
    const [postsChanged, indexChanged] = await Promise.all([
        generateBlogPostsModule(projectRoot),
        generateBlogIndexJson(projectRoot),
    ]);

    // Mirror step must happen after index.json generation to keep public/blogs consistent.
    const mirrorChanged = await syncBlogsToPublic(projectRoot);

    const changed = postsChanged || indexChanged || mirrorChanged;
    if (server && changed) {
        server.ws.send({ type: "full-reload" });
    }
    return changed;
}

export function blogPostsPlugin(): Plugin {
    let root = process.cwd();

    return {
        name: "blog-posts-plugin",
        enforce: "pre",
        configResolved(config) {
            root = config.root;
        },
        async buildStart() {
            await regenerate(root);
        },
        configureServer(server) {
            const sourceBlogsDir = path.join(root, "blogs");
            void regenerate(root, server);

            server.watcher.add(sourceBlogsDir);
            server.watcher.on("all", async (event, file) => {
                // Only react to changes under <root>/blogs (the source directory).
                // Avoid loops triggered by writing to public/blogs or generated files.
                const normalized = path.resolve(file);
                const sourceRoot = path.resolve(sourceBlogsDir) + path.sep;
                if (!normalized.startsWith(sourceRoot)) return;

                // index.json is generated by this plugin; ignore its changes to avoid self-trigger loops.
                const generatedIndexPath = path.resolve(path.join(sourceBlogsDir, "index.json"));
                if (normalized === generatedIndexPath) return;

                if (event === "add" || event === "change" || event === "unlink") {
                    await regenerate(root, server);
                }
            });
        },
    };
}
