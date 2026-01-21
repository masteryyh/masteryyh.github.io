import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { blogPostsPlugin } from "./scripts/vite-plugin-blog-posts";

// https://vite.dev/config/
export default defineConfig({
    plugins: [blogPostsPlugin(), react()],
    build: {
        // Enable chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: (id: string) => {
                    // Vendor chunk: React and core libraries
                    if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router-dom")) {
                        return "vendor-react";
                    }
                    // i18n chunk: Internationalization libraries
                    if (id.includes("node_modules/i18next") || id.includes("node_modules/react-i18next")) {
                        return "vendor-i18n";
                    }
                    // UI chunk: UI component libraries
                    if (id.includes("node_modules/@fortawesome")) {
                        return "vendor-ui";
                    }
                    // Markdown chunk: Blog post rendering
                    if (
                        id.includes("node_modules/react-markdown") ||
                        id.includes("node_modules/remark-") ||
                        id.includes("node_modules/rehype-")
                    ) {
                        return "vendor-markdown";
                    }
                },
                // Optimize chunk file naming for better caching
                chunkFileNames: "assets/js/[name]-[hash].js",
                entryFileNames: "assets/js/[name]-[hash].js",
                assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
            },
        },
        // Optimize build performance
        cssCodeSplit: true,
        sourcemap: false, // Disable sourcemaps in production for smaller builds
        minify: true, // Use default minifier (rolldown handles this)
        target: "es2020", // Modern browsers target
        // Increase chunk size warning limit for vendor chunks
        chunkSizeWarningLimit: 1000,
    },
    server: {
        port: 5173
    },
});
