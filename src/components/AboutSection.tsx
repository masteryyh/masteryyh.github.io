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
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    {items.map((item, index) => (
                        <li key={item} className="group flex gap-3">
                            <span
                                className="mt-1.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 text-xs font-semibold text-emerald-700 transition-all duration-200 group-hover:scale-110 group-hover:shadow-md dark:from-emerald-950/40 dark:to-cyan-950/40 dark:text-emerald-400"
                                aria-hidden="true"
                            >
                                {index + 1}
                            </span>
                            <span className="flex-1 leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </Section>
    );
}
