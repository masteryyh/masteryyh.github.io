import { memo } from "react";
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
    isLoading?: boolean;
    errorMessage?: string;
};

export const CertsSection = memo(function CertsSection({ title, validLabel, viewLabel, certs, isLoading, errorMessage }: CertsSectionProps) {
    return (
        <Section id="certs" title={title}>
            {errorMessage ? (
                <Card>
                    <div className="font-mono text-sm text-text-secondary">{errorMessage}</div>
                </Card>
            ) : isLoading ? (
                <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
                    {Array.from({ length: 2 }).map((_, idx) => (
                        <Card key={idx}>
                            <div className="animate-pulse">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="h-4 w-56 rounded bg-border" />
                                        <div className="mt-2 h-4 w-44 rounded bg-border" />
                                    </div>
                                    <div className="shrink-0 self-start">
                                        <div className="h-6 w-14 rounded bg-border" />
                                    </div>
                                </div>
                                <div className="mt-4 h-4 w-24 rounded bg-border" />
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {certs.map((c) => (
                        <Card key={c.name}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words font-mono text-sm font-semibold leading-snug text-text-primary">
                                        {c.name}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2 font-mono text-xs text-text-muted">
                                        <span>{c.issuer}</span>
                                        <span
                                            className="h-1 w-1 rounded-full bg-text-muted"
                                            aria-hidden="true"
                                        />
                                        <time>{c.year}</time>
                                    </div>
                                </div>
                                <div className="shrink-0 self-start">
                                    <Badge tone="accent">{validLabel}</Badge>
                                </div>
                            </div>
                            <div className="mt-4 text-sm">
                                <ExternalLink href={c.href}>{viewLabel}</ExternalLink>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </Section>
    );
});
