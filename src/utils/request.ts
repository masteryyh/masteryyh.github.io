import axios, { AxiosError } from "axios";
import type { Method } from "axios";

type RequestOptions = {
    signal?: AbortSignal;
    headers?: HeadersInit;
    body?: unknown;
};

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
    if (!headers) return {};

    if (headers instanceof Headers) {
        const out: Record<string, string> = {};
        headers.forEach((value, key) => {
            out[key] = value;
        });
        return out;
    }

    if (Array.isArray(headers)) {
        return headers.reduce<Record<string, string>>((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
    }
    return headers as Record<string, string>;
}

export async function request<T>(method: Method, url: string, options: RequestOptions = {}): Promise<T> {
    try {
        const res = await axios.request<T>({
            method,
            url,
            ...(options.body ? { data: options.body } : {}),
            headers: {
                ...normalizeHeaders(options.headers),
            },
            signal: options.signal,
        });
        return res.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            const status = err.response?.status;
            const statusText = err.response?.statusText;
            if (typeof status === "number") {
                throw new Error(`Failed to fetch ${url}: ${status} ${statusText ?? ""}`.trimEnd());
            }
        }
        throw err;
    }
}

export async function get<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>("get", url, options);
}

export async function post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("post", url, { ...options, body });
}
