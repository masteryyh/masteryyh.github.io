import { memo } from "react";
import type { ReactNode } from "react";

type BadgeProps = {
    children: ReactNode;
    tone?: "neutral" | "accent" | "warn";
};

const toneToClass: Record<NonNullable<BadgeProps["tone"]>, string> = {
    neutral:
        "border-border bg-transparent text-text-secondary",
    accent:
        "border-accent/40 bg-accent-muted text-accent",
    warn:
        "border-warn/40 bg-warn-muted text-warn",
};

export const Badge = memo(function Badge({ children, tone = "neutral" }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs font-medium leading-none ${toneToClass[tone]}`}
        >
            {children}
        </span>
    );
});
