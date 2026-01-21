import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingFallback } from "./components/LoadingFallback";

const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const BlogListPage = lazy(() => import("./blog/BlogListPage").then((m) => ({ default: m.BlogListPage })));
const BlogPostPage = lazy(() => import("./blog/BlogPostPage").then((m) => ({ default: m.BlogPostPage })));
const GitHubCallbackPage = lazy(() =>
    import("./pages/GitHubCallbackPage").then((m) => ({ default: m.GitHubCallbackPage })),
);

export default function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blogs" element={<BlogListPage />} />
                <Route path="/blogs/:id" element={<BlogPostPage />} />
                <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}
