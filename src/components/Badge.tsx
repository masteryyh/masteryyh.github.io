import type { ReactNode } from "react";

type BadgeProps = {
    children: ReactNode;
    tone?: "neutral" | "accent" | "warn";
};

const toneToClass: Record<NonNullable<BadgeProps["tone"]>, string> = {
    neutral:
        "border-slate-200/80 bg-slate-50 text-slate-700 hover:border-slate-300/80 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-700/80",
    accent:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 hover:border-emerald-500/40 dark:text-emerald-200 dark:hover:border-emerald-400/40",
    warn: "border-amber-500/30 bg-amber-500/10 text-amber-800 hover:border-amber-500/40 dark:text-amber-200 dark:hover:border-amber-400/40",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs leading-none transition-colors ${toneToClass[tone]}`}
        >
            {children}
        </span>
    );
}
