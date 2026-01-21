import type { ReactNode } from "react";

type CardProps = {
    children: ReactNode;
    className?: string;
};

export function Card({ children, className }: CardProps) {
    return (
        <div
            className={`group relative isolate overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-4 shadow-soft transition-all duration-300 hover:border-slate-300/80 hover:shadow-soft-lg dark:border-slate-800/50 dark:bg-slate-900/90 dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] dark:hover:border-slate-700/70 sm:p-6 ${className ?? ""}`}
        >
            {/* Subtle gradient overlay on hover */}
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.03), transparent 60%)",
                }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
