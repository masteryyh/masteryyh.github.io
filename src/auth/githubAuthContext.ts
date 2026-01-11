import { createContext, useContext } from "react";
import type { GitHubUser } from "../utils/api";

export type AuthState = {
    user: GitHubUser | null;
    isReady: boolean;
    isAuthenticating: boolean;
    login: () => void;
    logout: () => void;
    handleCallback: (code: string, state: string, options?: { signal?: AbortSignal }) => Promise<void>;
};

export const GitHubAuthContext = createContext<AuthState | null>(null);

export function useGitHubAuth(): AuthState {
    const ctx = useContext(GitHubAuthContext);
    if (!ctx) {
        throw new Error("useGitHubAuth must be used within GitHubAuthProvider");
    }
    return ctx;
}
