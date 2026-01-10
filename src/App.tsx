import { Navigate, Route, Routes } from "react-router-dom";
import { GitHubCallbackPage } from "./pages/GitHubCallbackPage";
import { HomePage } from "./pages/HomePage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
