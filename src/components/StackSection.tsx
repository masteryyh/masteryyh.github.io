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
};

export function StackSection({ title, groups }: StackSectionProps) {
    return (
        <Section id="stack" title={title}>
            <div className="grid gap-4 md:grid-cols-2">
                {groups.map((group) => (
                    <Card key={group.title}>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {group.title}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {group.items.map((it) => (
                                <Badge key={it} tone="neutral">
                                    {it}
                                </Badge>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </Section>
    );
}
