import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { GitHubUser } from "../utils/api";
import {
    clearGitHubAuthStorage,
    isTokenExpired,
    loadStoredToken,
    loadStoredUser,
    saveStoredToken,
    saveStoredUser,
} from "./githubStorage";
import { fetchGitHubUser, startGitHubLogin, tokenExchange } from "../utils/api";
import { GitHubAuthContext, type AuthState } from "./githubAuthContext";

export function GitHubAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        const token = loadStoredToken();
        const storedUser = loadStoredUser();

        if (!token) {
            setUser(null);
            setIsReady(true);
            return;
        }

        if (isTokenExpired(token)) {
            clearGitHubAuthStorage();
            setUser(null);
            setIsReady(true);
            return;
        }

        if (storedUser) {
            setUser(storedUser);
            setIsReady(true);
            return;
        }

        void (async () => {
            try {
                const u = await fetchGitHubUser(token.accessToken);
                saveStoredUser(u);
                setUser(u);
            } catch (e) {
                console.warn("Failed to fetch GitHub user; clearing stored token", e);
                clearGitHubAuthStorage();
                setUser(null);
            } finally {
                setIsReady(true);
            }
        })();
    }, []);

    const login = useCallback(() => {
        startGitHubLogin();
    }, []);

    const logout = useCallback(() => {
        clearGitHubAuthStorage();
        setUser(null);
    }, []);

    const handleCallback = useCallback(async (code: string, state: string, options?: { signal?: AbortSignal }) => {
        setIsAuthenticating(true);
        try {
            const tokenRes = await tokenExchange({ code, state, signal: options?.signal });
            const tokenData = tokenRes.data;

            const expiresIn = typeof tokenData.expires_in === "number" ? tokenData.expires_in : 60 * 60 * 24 * 30;
            const expiresAt = Date.now() + expiresIn * 1000;

            saveStoredToken({
                accessToken: tokenData.access_token,
                tokenType: tokenData.token_type,
                scope: tokenData.scope,
                expiresAt,
                refreshToken: tokenData.refresh_token,
            });

            const u = await fetchGitHubUser(tokenData.access_token, { signal: options?.signal });
            saveStoredUser(u);
            setUser(u);
        } finally {
            setIsAuthenticating(false);
        }
    }, []);

    const value = useMemo<AuthState>(
        () => ({
            user,
            isReady,
            isAuthenticating,
            login,
            logout,
            handleCallback,
        }),
        [user, isReady, isAuthenticating, login, logout, handleCallback],
    );

    return <GitHubAuthContext.Provider value={value}>{children}</GitHubAuthContext.Provider>;
}
