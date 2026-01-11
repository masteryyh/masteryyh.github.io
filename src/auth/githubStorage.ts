import type { GitHubUser } from "../utils/api";

type StoredToken = {
    accessToken: string;
    tokenType?: string;
    scope?: string;
    expiresAt: number; // epoch ms
    refreshToken?: string;
};

const LS_TOKEN = "oauth_token";
const LS_USER = "github_user";

export function loadStoredToken(): StoredToken | null {
    const raw = localStorage.getItem(LS_TOKEN);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as StoredToken;
        if (!parsed?.accessToken || typeof parsed.expiresAt !== "number" || parsed.expiresAt < Date.now()) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function saveStoredToken(token: StoredToken): void {
    localStorage.setItem(LS_TOKEN, JSON.stringify(token));
}

export function clearStoredToken(): void {
    localStorage.removeItem(LS_TOKEN);
}

export function isTokenExpired(token: StoredToken): boolean {
    return Date.now() >= token.expiresAt;
}

export function loadStoredUser(): GitHubUser | null {
    const raw = localStorage.getItem(LS_USER);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as GitHubUser;
        if (!parsed?.login || !parsed?.avatar_url) return null;
        return parsed;
    } catch {
        return null;
    }
}

export function saveStoredUser(user: GitHubUser): void {
    localStorage.setItem(LS_USER, JSON.stringify(user));
}

export function clearStoredUser(): void {
    localStorage.removeItem(LS_USER);
}

export function clearGitHubAuthStorage(): void {
    clearStoredToken();
    clearStoredUser();
}
