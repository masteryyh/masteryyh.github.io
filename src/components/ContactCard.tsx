import type { ReactNode } from "react";
import { memo } from "react";
import { Badge } from "./Badge";
import { Card } from "./Card";
import { ExternalLink } from "./ExternalLink";
import { useTranslation } from "react-i18next";

type ContactInfo = {
    email: string;
    wechat: string;
    phone: string;
    github: string;
    linkedin: string;
};

function ContactRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="group flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <span className="font-mono text-xs text-text-muted">{label}</span>
            {children}
        </div>
    );
}

function ContactValue({ children }: { children: ReactNode }) {
    return (
        <span className="min-w-0 break-all font-mono text-sm text-text-primary transition-colors duration-200 group-hover:text-accent sm:text-right">
            {children}
        </span>
    );
}

export const ContactCard = memo(function ContactCard({ contact }: { contact: ContactInfo }) {
    const { t } = useTranslation();

    return (
        <Card>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="font-mono text-sm font-semibold text-text-primary">{t("contact.title")}</h3>
                </div>
                <Badge tone="neutral">UTC+8</Badge>
            </div>

            <div className="mt-4">
                <ContactRow label={t("contact.email")}>
                    <ContactValue>{contact.email}</ContactValue>
                </ContactRow>
                <ContactRow label={t("contact.wechat")}>
                    <ContactValue>{contact.wechat}</ContactValue>
                </ContactRow>
                <ContactRow label={t("contact.phone")}>
                    <ContactValue>{contact.phone}</ContactValue>
                </ContactRow>
                <ContactRow label={t("contact.github")}>
                    <ExternalLink href={contact.github}>{t("actions.open")}</ExternalLink>
                </ContactRow>
                <ContactRow label={t("contact.linkedin")}>
                    <ExternalLink href={contact.linkedin}>{t("actions.open")}</ExternalLink>
                </ContactRow>
            </div>
        </Card>
    );
});
