import { generateCodeChallengeS256, generateCodeVerifier, generateState } from "./pkce";
import { get, post } from "../utils/request";
import type { GitHubUser } from "./githubStorage";

const SS_CODE_VERIFIER = "github_pkce_code_verifier_v1";
const SS_OAUTH_STATE = "github_oauth_state_v1";

type TokenResponse = {
    code: number;
    message: string;
    data: {
        access_token: string;
        token_type?: string;
        scope?: string;
        expires_in?: number;
        refresh_token?: string;
        refresh_token_expires_in?: number;
    }
};

type ExchangeOptions = {
    signal?: AbortSignal;
};

export function getGitHubClientId(): string {
    const id = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined;
    if (!id) {
        throw new Error("Missing VITE_GITHUB_CLIENT_ID");
    }
    return id;
}

export function getGitHubRedirectUri(): string {
    const fromEnv = import.meta.env.VITE_GITHUB_REDIRECT_URI as string | undefined;
    if (fromEnv) return fromEnv;
    return `${window.location.origin}/auth/github/callback`;
}

export function startGitHubPkceLogin(): void {
    const clientId = getGitHubClientId();
    const redirectUri = getGitHubRedirectUri();

    const verifier = generateCodeVerifier(64);
    const state = generateState();

    sessionStorage.setItem(SS_CODE_VERIFIER, verifier);
    sessionStorage.setItem(SS_OAUTH_STATE, state);

    void (async () => {
        const challenge = await generateCodeChallengeS256(verifier);
        const scope = (import.meta.env.VITE_GITHUB_SCOPES as string | undefined) ?? "read:user";

        const url = new URL("https://github.com/login/oauth/authorize");
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("scope", scope);
        url.searchParams.set("state", state);
        url.searchParams.set("code_challenge", challenge);
        url.searchParams.set("code_challenge_method", "S256");

        window.location.assign(url.toString());
    })();
}

function clearPkceSessionState(): void {
    sessionStorage.removeItem(SS_OAUTH_STATE);
    sessionStorage.removeItem(SS_CODE_VERIFIER);
}

function getPkceVerifier(expectedState: string): string {
    const storedState = sessionStorage.getItem(SS_OAUTH_STATE);
    const verifier = sessionStorage.getItem(SS_CODE_VERIFIER);

    if (!storedState || storedState !== expectedState) {
        throw new Error("Invalid OAuth state");
    }
    if (!verifier) {
        throw new Error("Missing PKCE code_verifier");
    }
    return verifier;
}

export async function exchangeGitHubCodeForToken(code: string, state: string, options?: ExchangeOptions): Promise<TokenResponse> {
    const clientId = getGitHubClientId();
    const redirectUri = getGitHubRedirectUri();
    const codeVerifier = getPkceVerifier(state);

    try {
        const res = await post<TokenResponse>("https://oauth-proxy.masteryyh.win", {
            client_id: clientId,
            redirect_uri: redirectUri,
            code,
            code_verifier: codeVerifier,
        }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            signal: options?.signal,
        });

        if (!res.data.access_token) {
            throw new Error("Token exchange failed: missing access_token");
        }
        return res;
    } catch (err) {
        if (options?.signal?.aborted) {
            throw err;
        }
        throw new Error(`Failed to exchange code for token: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
        clearPkceSessionState();
    }
}

export async function fetchGitHubUser(accessToken: string, options?: { signal?: AbortSignal }): Promise<GitHubUser> {
    return await get<GitHubUser>("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        signal: options?.signal,
    });
}
