import { Badge } from "./Badge";
import { Card } from "./Card";
import { ExternalLink } from "./ExternalLink";
import { Section } from "./Section";

type Cert = {
    name: string;
    issuer: string;
    year: string;
    href: string;
};

type CertsSectionProps = {
    title: string;
    validLabel: string;
    viewLabel: string;
    certs: Cert[];
};

export function CertsSection({ title, validLabel, viewLabel, certs }: CertsSectionProps) {
    return (
        <Section id="certs" title={title}>
            <div className="grid gap-4 md:grid-cols-2">
                {certs.map((c) => (
                    <Card key={c.name}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
                                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    {c.issuer} • {c.year}
                                </div>
                            </div>
                            <Badge tone="accent">{validLabel}</Badge>
                        </div>
                        <div className="mt-4 text-sm">
                            <ExternalLink href={c.href}>{viewLabel}</ExternalLink>
                        </div>
                    </Card>
                ))}
            </div>
        </Section>
    );
}
