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
            className="group relative inline-flex items-center gap-1 font-medium text-emerald-600 transition-all duration-200 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
            <span className="relative">
                {children}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-transform duration-300 group-hover:scale-x-100" />
            </span>
            <svg
                className="h-3 w-3 opacity-60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
            </svg>
        </a>
    );
}
