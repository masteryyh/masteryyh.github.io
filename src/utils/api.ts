import { generateCodeChallengeS256, generateCodeVerifier, generateState } from "./pkce";
import { get, post } from "./request";

function getGitHubClientId(): string {
    const id = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined;
    if (!id) {
        throw new Error("Missing VITE_GITHUB_CLIENT_ID");
    }
    return id;
}

function getGitHubRedirectUri(): string {
    const fromEnv = import.meta.env.VITE_GITHUB_REDIRECT_URI as string | undefined;
    if (fromEnv) return fromEnv;
    return `${import.meta.env.VITE_BASE_URL}/auth/github/callback`;
}

function getOAuthProxyUri(): string {
    const fromEnv = import.meta.env.VITE_GH_PROXY_URL as string | undefined;
    if (fromEnv) return fromEnv;
    return "https://oauth-proxy.masteryyh.win";
}

export type GitHubUser = {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
};

export async function fetchGitHubUser(accessToken: string, options?: { signal?: AbortSignal }): Promise<GitHubUser> {
    return await get<GitHubUser>("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        signal: options?.signal,
    });
}

function getPkceVerifier(expectedState: string): string {
    const storedState = sessionStorage.getItem(OAUTH_STATE_KEY);
    const verifier = sessionStorage.getItem(CODE_VERIFIER_KEY);

    if (!storedState || storedState !== expectedState) {
        throw new Error("Invalid OAuth state");
    }
    if (!verifier) {
        throw new Error("Missing PKCE code_verifier");
    }
    return verifier;
}

type ExchangeOptions = {
    code: string;
    state: string;
    signal?: AbortSignal;
};

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

const CODE_VERIFIER_KEY = "code_verifier";
const OAUTH_STATE_KEY = "oauth_state";

export async function tokenExchange(options: ExchangeOptions): Promise<TokenResponse> {
    const clientId = getGitHubClientId();
    const redirectUri = getGitHubRedirectUri();
    const codeVerifier = getPkceVerifier(options.state);

    try {
        const res = await post<TokenResponse>(getOAuthProxyUri(), {
            client_id: clientId,
            redirect_uri: redirectUri,
            code: options.code,
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
        sessionStorage.removeItem(OAUTH_STATE_KEY);
        sessionStorage.removeItem(CODE_VERIFIER_KEY);
    }
}

export function startGitHubLogin(): void {
    const clientId = getGitHubClientId();
    const redirectUri = getGitHubRedirectUri();

    const verifier = generateCodeVerifier(64);
    const state = generateState();

    sessionStorage.setItem(CODE_VERIFIER_KEY, verifier);
    sessionStorage.setItem(OAUTH_STATE_KEY, state);
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

export interface BlogIndex {
    posts: BlogMetadata[];
}

export interface BlogMetadata {
    id: string;
    date: string;
    published: boolean;
    highlight?: boolean;
}

export async function loadBlogIndex() {
    return await get<BlogIndex>(`${import.meta.env.VITE_BASE_URL}/blogs/index.json`);
}
