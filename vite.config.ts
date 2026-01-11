import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { blogPostsPlugin } from "./scripts/vite-plugin-blog-posts";

// https://vite.dev/config/
export default defineConfig({
    plugins: [blogPostsPlugin(), react()],
});
