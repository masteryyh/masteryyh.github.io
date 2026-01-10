function base64UrlEncode(bytes: Uint8Array): string {
    let str = "";
    for (const b of bytes) {
        str += String.fromCharCode(b);
    }

    const base64 = btoa(str);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function generateCodeVerifier(length = 64): string {
    // RFC 7636: code_verifier should be 43..128 chars
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return base64UrlEncode(bytes);
}

export async function generateCodeChallengeS256(codeVerifier: string): Promise<string> {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return base64UrlEncode(new Uint8Array(digest));
}

export function generateState(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return base64UrlEncode(bytes);
}
