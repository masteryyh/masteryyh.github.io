import { Card } from "./Card";
import { Section } from "./Section";

type AboutSectionProps = {
    title: string;
    items: string[];
};

export function AboutSection({ title, items }: AboutSectionProps) {
    return (
        <Section id="about" title={title}>
            <Card>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                    {items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </Card>
        </Section>
    );
}
