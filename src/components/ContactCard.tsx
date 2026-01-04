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
    credly: string;
};

export function ContactCard({ contact }: { contact: ContactInfo }) {
    const { t } = useTranslation();

    return (
        <Card>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t("contact.title")}</h3>
                </div>
                <Badge tone="neutral">UTC+8</Badge>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.email")}</span>
                    <span className="font-mono text-slate-900 dark:text-slate-200">
                        {contact.email}
                    </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.wechat")}</span>
                    <span className="font-mono text-slate-900 dark:text-slate-200">
                        {contact.wechat}
                    </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.phone")}</span>
                    <span className="font-mono text-slate-900 dark:text-slate-200">
                        {contact.phone}
                    </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.github")}</span>
                    <ExternalLink href={contact.github}>{t("actions.open")}</ExternalLink>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.linkedin")}</span>
                    <ExternalLink href={contact.linkedin}>{t("actions.open")}</ExternalLink>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.credly")}</span>
                    <ExternalLink href={contact.credly}>{t("actions.open")}</ExternalLink>
                </div>
            </div>
        </Card>
    );
}