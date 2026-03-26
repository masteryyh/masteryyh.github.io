import { memo } from "react";
import type { ReactNode } from "react";

type SectionProps = {
    id?: string;
    title: string;
    subtitle?: string;
    children: ReactNode;
};

export const Section = memo(function Section({ id, title, subtitle, children }: SectionProps) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="mb-5 sm:mb-6">
                <h2 className="flex items-center gap-2 font-mono text-base font-semibold tracking-tight text-text-primary sm:text-lg">
                    <span className="text-accent" aria-hidden="true">#</span>
                    <span>{title}</span>
                </h2>
                {subtitle ? (
                    <p className="mt-1.5 text-xs text-text-secondary sm:text-sm">{subtitle}</p>
                ) : null}
            </div>
            {children}
        </section>
    );
});
