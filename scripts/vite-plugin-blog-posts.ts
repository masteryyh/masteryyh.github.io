import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Plugin, ViteDevServer } from "vite";

interface FrontmatterData {
    title?: string;
    description?: string;
    date?: unknown;
    tags?: string[];
    cover?: string;
    highlight?: boolean;
    published?: boolean;
}

interface BlogIndexLangEntry {
    title: string;
    description: string;
    date: string;
    tags: string[];
    cover?: string;
    readingTime: number;
}

interface BlogIndexEntry {
    id: string;
    highlight?: boolean;
    langs: Record<string, BlogIndexLangEntry>;
}

function isValidDate(d: Date): boolean {
    return Number.isFinite(d.getTime());
}

function normalizeFrontmatterDateToIso(value: unknown): string | null {
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

function estimateReadingTime(content: string): number {
    return Math.max(1, Math.ceil(content.length / 400));
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
    if (prev === next) return false;
    await fs.writeFile(filePath, next, "utf8");
    return true;
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

function toPosixRelativePath(p: string) {
    return p.split(path.sep).join("/");
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

async function generateBlogAssets(projectRoot: string) {
    const blogsDir = path.join(projectRoot, "blogs");
    const outDir = path.join(projectRoot, "public", "assets", "blogs");

    await fs.mkdir(outDir, { recursive: true });

    if (!(await fileExists(blogsDir))) {
        const emptyIndex = JSON.stringify([], null, 2) + "\n";
        await writeTextIfChanged(path.join(outDir, "index.json"), emptyIndex);
        return false;
    }

    const dirents = await fs.readdir(blogsDir, { withFileTypes: true });
    const indexEntries: BlogIndexEntry[] = [];
    const expectedFiles = new Map<string, string>();

    for (const d of dirents) {
        if (!d.isDirectory()) continue;
        const id = d.name;
        const postDir = path.join(blogsDir, id);
        const files = await fs.readdir(postDir);
        const mdFiles = files.filter((f) => f.endsWith(".md"));

        if (mdFiles.length === 0) continue;

        let isPublished = true;
        const variants: Array<{
            lang: string;
            data: FrontmatterData;
            content: string;
            fullPath: string;
        }> = [];

        for (const file of mdFiles) {
            const lang = file.replace(/\.md$/, "");
            const fullPath = path.join(postDir, file);
            const raw = await fs.readFile(fullPath, "utf8");
            const parsed = matter(raw);
            const data = (typeof parsed.data === "object" && parsed.data ? parsed.data : {}) as FrontmatterData;

            if (data.published === false) {
                isPublished = false;
                break;
            }

            variants.push({ lang, data, content: parsed.content ?? "", fullPath });
        }

        if (!isPublished || variants.length === 0) continue;

        const langs: Record<string, BlogIndexLangEntry> = {};
        let highlight = false;

        for (const { lang, data, content, fullPath } of variants) {
            const fallbackIso = await getFileFallbackDateIso(fullPath);
            const dateIso = normalizeFrontmatterDateToIso(data.date) ?? fallbackIso;

            langs[lang] = {
                title: data.title ?? id,
                description: data.description ?? "",
                date: dateIso,
                tags: data.tags ?? [],
                ...(data.cover ? { cover: data.cover } : {}),
                readingTime: estimateReadingTime(content),
            };

            if (data.highlight === true) highlight = true;

            const destPath = path.join(outDir, id, `${lang}.md`);
            await fs.mkdir(path.join(outDir, id), { recursive: true });
            const wrote = await writeTextIfChanged(destPath, content);
            if (wrote) expectedFiles.set(`${id}/${lang}.md`, destPath);
            else expectedFiles.set(`${id}/${lang}.md`, destPath);
        }

        const entry: BlogIndexEntry = { id, langs };
        if (highlight) entry.highlight = true;

        indexEntries.push(entry);
    }

    indexEntries.sort((a, b) => {
        const dateA = Object.values(a.langs)[0]?.date ?? "";
        const dateB = Object.values(b.langs)[0]?.date ?? "";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    const indexJson = JSON.stringify(indexEntries, null, 2) + "\n";
    const indexChanged = await writeTextIfChanged(path.join(outDir, "index.json"), indexJson);

    // Clean stale files: remove .md files in outDir that aren't in expectedFiles
    if (await fileExists(outDir)) {
        const allFiles = await listFilesRecursive(outDir);
        for (const abs of allFiles) {
            const rel = toPosixRelativePath(path.relative(outDir, abs));
            if (rel === "index.json") continue;
            if (!expectedFiles.has(rel)) {
                await fs.unlink(abs);
            }
        }
        await removeEmptyDirsRecursive(outDir);
        await fs.mkdir(outDir, { recursive: true });
    }

    return indexChanged;
}

async function regenerate(projectRoot: string, server?: ViteDevServer) {
    const changed = await generateBlogAssets(projectRoot);

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
                const normalized = path.resolve(file);
                const sourceRoot = path.resolve(sourceBlogsDir) + path.sep;
                if (!normalized.startsWith(sourceRoot)) return;

                if (event === "add" || event === "change" || event === "unlink") {
                    await regenerate(root, server);
                }
            });
        },
    };
}
