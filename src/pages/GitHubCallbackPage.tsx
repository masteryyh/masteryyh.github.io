import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGitHubAuth } from "../auth/githubAuthContext";

export function GitHubCallbackPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { handleCallback } = useGitHubAuth();

    const attemptRef = useRef<{ key: string; status: "idle" | "inflight" | "done" }>({
        key: "",
        status: "idle",
    });

    const code = params.get("code") ?? "";
    const state = params.get("state") ?? "";
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    const [message, setMessage] = useState("Completing GitHub login…");

    const errorText = useMemo(() => {
        if (!error) return "";
        return [error, errorDescription].filter(Boolean).join(": ");
    }, [error, errorDescription]);

    const blockingMessage = useMemo(() => {
        if (errorText) return `GitHub login failed: ${errorText}`;
        if (!code || !state) return "Invalid GitHub callback URL (missing code/state)";
        return "";
    }, [code, state, errorText]);

    useEffect(() => {
        if (blockingMessage) return;

        const key = `${code}:${state}`;
        const current = attemptRef.current;

        if (current.key === key && (current.status === "inflight" || current.status === "done")) {
            return;
        }

        attemptRef.current = { key, status: "inflight" };

        const controller = new AbortController();

        void (async () => {
            try {
                await handleCallback(code, state, { signal: controller.signal });
                attemptRef.current = { key, status: "done" };
                navigate("/", { replace: true });
            } catch (e) {
                if (controller.signal.aborted) return;
                attemptRef.current = { key, status: "idle" };
                setMessage(e instanceof Error ? e.message : String(e));
            }
        })();

        return () => {
            controller.abort();
            // Allow a subsequent effect run (e.g., StrictMode/dev) to retry.
            const latest = attemptRef.current;
            if (latest.key === key && latest.status === "inflight") {
                attemptRef.current = { key, status: "idle" };
            }
        };
    }, [blockingMessage, code, state, handleCallback, navigate]);

    return (
        <div className="min-h-dvh relative">
            <div className="bg-grid" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="mx-4 flex max-w-md flex-col items-center gap-4 text-center">
                    <div
                        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-400 border-t-transparent dark:border-slate-500 dark:border-t-transparent"
                        aria-hidden="true"
                    />
                    <p className="text-sm text-slate-700 dark:text-slate-200">{blockingMessage || message}</p>
                    <button
                        type="button"
                        className="rounded-md border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/90 dark:border-slate-800/70 dark:bg-slate-950/35 dark:text-slate-200 dark:hover:bg-slate-950/55"
                        onClick={() => navigate("/", { replace: true })}
                    >
                        Back to home
                    </button>
                </div>
            </div>
        </div>
    );
}
