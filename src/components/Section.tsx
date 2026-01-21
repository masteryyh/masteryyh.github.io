import type { ReactNode } from "react";

type SectionProps = {
    id?: string;
    title: string;
    subtitle?: string;
    children: ReactNode;
};

export function Section({ id, title, subtitle, children }: SectionProps) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="mb-5 sm:mb-6">
                <h2 className="flex items-center gap-3 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-lg">
                    <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_0_4px_rgba(16,185,129,0.15),0_0_12px_rgba(16,185,129,0.3)] dark:from-emerald-500 dark:to-cyan-500 dark:shadow-[0_0_0_4px_rgba(16,185,129,0.2),0_0_16px_rgba(16,185,129,0.4)]"
                    />
                    <span>{title}</span>
                </h2>
                {subtitle ? (
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">{subtitle}</p>
                ) : null}
            </div>
            {children}
        </section>
    );
}
