import type { ReactNode } from "react";

type ExternalLinkProps = {
    href: string;
    children: ReactNode;
};

export function ExternalLink({ href, children }: ExternalLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 underline underline-offset-4 decoration-emerald-600/30 transition-colors hover:text-emerald-800 hover:decoration-emerald-600/40 dark:text-emerald-300 dark:decoration-emerald-500/40 dark:hover:text-emerald-200 dark:hover:decoration-emerald-400/50"
        >
            {children}
        </a>
    );
}
