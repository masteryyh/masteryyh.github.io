import { Navigate, Route, Routes } from "react-router-dom";
import { GitHubCallbackPage } from "./pages/GitHubCallbackPage";
import { HomePage } from "./pages/HomePage";
import { BlogListPage } from "./blog/BlogListPage";
import { BlogPostPage } from "./blog/BlogPostPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/:id" element={<BlogPostPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
