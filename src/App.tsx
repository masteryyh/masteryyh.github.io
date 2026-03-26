import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingFallback } from "./components/LoadingFallback";
import { ErrorBoundary } from "./components/ErrorBoundary";

const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const BlogListPage = lazy(() => import("./blog/BlogListPage").then((m) => ({ default: m.BlogListPage })));
const BlogPostPage = lazy(() => import("./blog/BlogPostPage").then((m) => ({ default: m.BlogPostPage })));
const GitHubCallbackPage = lazy(() =>
    import("./pages/GitHubCallbackPage").then((m) => ({ default: m.GitHubCallbackPage })),
);

export default function App() {
    return (
        <ErrorBoundary>
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-elevated focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-accent focus:shadow-card focus:ring-2 focus:ring-accent"
            >
                Skip to content
            </a>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blogs" element={<BlogListPage />} />
                    <Route path="/blogs/:id" element={<BlogPostPage />} />
                    <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
}
