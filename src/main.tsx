import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { ThemeProvider } from "./theme/ThemeProvider";
import { GitHubAuthProvider } from "./auth/GitHubAuthProvider";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <GitHubAuthProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </GitHubAuthProvider>
        </ThemeProvider>
    </StrictMode>,
);
