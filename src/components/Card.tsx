import type { ReactNode } from "react";

type CardProps = {
    children: ReactNode;
    className?: string;
};

export function Card({ children, className }: CardProps) {
    return (
        <div
            className={`relative isolate rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_0_0_1px_rgba(15,23,42,0.05),0_22px_60px_-42px_rgba(15,23,42,0.22)] after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:-z-10 after:opacity-0 after:transition-opacity after:duration-300 after:shadow-[0_0_16px_rgba(16,185,129,0.09),0_0_32px_rgba(34,211,238,0.045)] hover:after:opacity-100 dark:border-slate-800/70 dark:bg-slate-950 dark:shadow-[0_0_0_1px_rgba(15,23,42,0.15),0_30px_80px_-40px_rgba(0,0,0,0.8)] dark:after:shadow-[0_0_22px_rgba(16,185,129,0.14),0_0_44px_rgba(34,211,238,0.06)] ${className ?? ""}`}
        >
            {children}
        </div>
    );
}
