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
            <div className="mb-4 sm:mb-5">
                <h2 className="flex items-center gap-3 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_0_4px_rgba(16,185,129,0.14)] dark:bg-emerald-400/80 dark:shadow-[0_0_0_4px_rgba(16,185,129,0.18)]" />
                    <span>{title}</span>
                </h2>
                {subtitle ? (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">{subtitle}</p>
                ) : null}
            </div>
            {children}
        </section>
    );
}
