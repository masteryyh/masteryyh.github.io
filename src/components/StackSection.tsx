import { Badge } from "./Badge";
import { Card } from "./Card";
import { Section } from "./Section";

type StackGroup = {
    title: string;
    items: string[];
};

type StackSectionProps = {
    title: string;
    groups: StackGroup[];
    isLoading?: boolean;
    errorMessage?: string;
};

export function StackSection({ title, groups, isLoading, errorMessage }: StackSectionProps) {
    return (
        <Section id="stack" title={title}>
            {errorMessage ? (
                <Card>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{errorMessage}</div>
                </Card>
            ) : isLoading ? (
                <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
                    {Array.from({ length: 2 }).map((_, idx) => (
                        <Card key={idx} aria-label="Loading tech stack">
                            <div className="animate-pulse">
                                <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {Array.from({ length: 8 }).map((__, j) => (
                                        <div key={j} className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {groups.map((group) => (
                        <Card key={group.title}>
                            <div className="mb-4 flex items-center gap-2">
                                <div
                                    className="h-1 w-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                    aria-hidden="true"
                                />
                                <h3 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-slate-50">
                                    {group.title}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {group.items.map((it) => (
                                    <Badge key={it} tone="neutral">
                                        {it}
                                    </Badge>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </Section>
    );
}
