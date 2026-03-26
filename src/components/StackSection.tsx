import { memo } from "react";
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

export const StackSection = memo(function StackSection({ title, groups, isLoading, errorMessage }: StackSectionProps) {
    return (
        <Section id="stack" title={title}>
            {errorMessage ? (
                <Card>
                    <div className="font-mono text-sm text-text-secondary">{errorMessage}</div>
                </Card>
            ) : isLoading ? (
                <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
                    {Array.from({ length: 2 }).map((_, idx) => (
                        <Card key={idx}>
                            <div className="animate-pulse">
                                <div className="h-4 w-40 rounded bg-border" />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {Array.from({ length: 8 }).map((__, j) => (
                                        <div key={j} className="h-6 w-20 rounded bg-border" />
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
                                <span className="font-mono text-xs text-accent" aria-hidden="true">&gt;</span>
                                <h3 className="font-mono text-sm font-semibold text-text-primary">
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
});
