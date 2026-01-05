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
                <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.email")}</span>
                    <span className="min-w-0 break-all font-mono text-slate-900 dark:text-slate-200 sm:text-right">
                        {contact.email}
                    </span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.wechat")}</span>
                    <span className="min-w-0 break-all font-mono text-slate-900 dark:text-slate-200 sm:text-right">
                        {contact.wechat}
                    </span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.phone")}</span>
                    <span className="min-w-0 break-all font-mono text-slate-900 dark:text-slate-200 sm:text-right">
                        {contact.phone}
                    </span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.github")}</span>
                    <ExternalLink href={contact.github}>{t("actions.open")}</ExternalLink>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.linkedin")}</span>
                    <ExternalLink href={contact.linkedin}>{t("actions.open")}</ExternalLink>
                </div>
            </div>
        </Card>
    );
}