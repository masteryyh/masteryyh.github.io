import type { ReactNode } from "react";

type BadgeProps = {
    children: ReactNode;
    tone?: "neutral" | "accent" | "warn";
};

const toneToClass: Record<NonNullable<BadgeProps["tone"]>, string> = {
    neutral:
        "border-slate-200/80 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:border-slate-600",
    accent: "border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-cyan-50 text-emerald-700 hover:from-emerald-100 hover:to-cyan-100 hover:border-emerald-500/60 dark:from-emerald-950/30 dark:to-cyan-950/30 dark:text-emerald-300 dark:hover:from-emerald-950/50 dark:hover:to-cyan-950/50 dark:border-emerald-500/30 dark:hover:border-emerald-400/50",
    warn: "border-amber-500/40 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 hover:from-amber-100 hover:to-orange-100 hover:border-amber-500/60 dark:from-amber-950/30 dark:to-orange-950/30 dark:text-amber-300 dark:hover:from-amber-950/50 dark:hover:to-orange-950/50 dark:border-amber-500/30 dark:hover:border-amber-400/50",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium leading-none transition-all duration-200 hover:scale-105 ${toneToClass[tone]}`}
        >
            {children}
        </span>
    );
}
