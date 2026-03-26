import { memo } from "react";
import type { ReactNode } from "react";

type CardProps = {
    children: ReactNode;
    className?: string;
};

export const Card = memo(function Card({ children, className }: CardProps) {
    return (
        <div
            className={`overflow-hidden rounded-lg border border-border bg-surface p-4 shadow-card transition-colors duration-200 hover:border-border-hover hover:shadow-card-hover sm:p-6 ${className ?? ""}`}
        >
            {children}
        </div>
    );
});
