import { memo } from "react";

export const LoadingFallback = memo(function LoadingFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-bg)" }}>
            <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
                <p className="mt-4 font-mono text-sm text-text-muted">loading...</p>
            </div>
        </div>
    );
});
