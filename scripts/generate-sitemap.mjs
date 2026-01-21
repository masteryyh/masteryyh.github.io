/**
 * Sitemap and robots.txt generation script
 * Run after Vite build to generate SEO files
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateSitemap() {
    const baseUrl = process.env.VITE_BASE_URL || "https://me.masteryyh.win";
    const distDir = path.join(__dirname, "..", "dist");
    const publicDir = path.join(__dirname, "..", "public");

    const urls = [
        {
            loc: `${baseUrl}/`,
            lastmod: new Date().toISOString().split("T")[0],
            changefreq: "weekly",
            priority: 1.0,
        },
        {
            loc: `${baseUrl}/blogs`,
            lastmod: new Date().toISOString().split("T")[0],
            changefreq: "weekly",
            priority: 0.9,
        },
    ];

    // Read blog posts from index.json
    try {
        const indexPath = path.join(publicDir, "blogs", "index.json");
        const indexContent = await fs.readFile(indexPath, "utf-8");
        const index = JSON.parse(indexContent);

        if (index.posts && Array.isArray(index.posts)) {
            for (const post of index.posts) {
                if (post.published !== false) {
                    urls.push({
                        loc: `${baseUrl}/blogs/${post.id}`,
                        lastmod: post.date || new Date().toISOString().split("T")[0],
                        changefreq: "monthly",
                        priority: 0.8,
                    });
                }
            }
        }
    } catch (error) {
        console.warn("Could not read blog index:", error);
    }

    // Generate sitemap XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
        .map(
            (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
        )
        .join("\n")}
</urlset>`;

    // Write sitemap to dist directory
    await fs.mkdir(distDir, { recursive: true });
    await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf-8");
    console.log("✅ Sitemap generated successfully");

    // Generate robots.txt
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

    await fs.writeFile(path.join(distDir, "robots.txt"), robotsTxt, "utf-8");
    console.log("✅ robots.txt generated successfully");
}

// Run
generateSitemap().catch(console.error);
