import { memo } from "react";
import { Card } from "./Card";
import { Section } from "./Section";

type AboutSectionProps = {
    title: string;
    items: string[];
};

export const AboutSection = memo(function AboutSection({ title, items }: AboutSectionProps) {
    return (
        <Section id="about" title={title}>
            <Card>
                <ul className="space-y-3 text-sm text-text-primary">
                    {items.map((item, index) => (
                        <li key={item} className="flex gap-3">
                            <span
                                className="mt-0.5 flex-shrink-0 font-mono text-xs font-semibold text-accent"
                                aria-hidden="true"
                            >
                                {String(index + 1).padStart(2, "0")}.
                            </span>
                            <span className="flex-1 leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </Section>
    );
});
