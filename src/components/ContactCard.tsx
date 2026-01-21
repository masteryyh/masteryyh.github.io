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
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{t("contact.title")}</h3>
                </div>
                <Badge tone="neutral">UTC+8</Badge>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
                <div className="group flex flex-col gap-1 rounded-xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/30 px-4 py-3 transition-all duration-200 hover:border-slate-300/80 hover:shadow-sm dark:border-slate-800/40 dark:from-slate-900/80 dark:to-slate-950/80 dark:hover:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.email")}</span>
                    <span className="min-w-0 break-all font-mono text-sm text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400 sm:text-right">
                        {contact.email}
                    </span>
                </div>
                <div className="group flex flex-col gap-1 rounded-xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/30 px-4 py-3 transition-all duration-200 hover:border-slate-300/80 hover:shadow-sm dark:border-slate-800/40 dark:from-slate-900/80 dark:to-slate-950/80 dark:hover:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.wechat")}</span>
                    <span className="min-w-0 break-all font-mono text-sm text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400 sm:text-right">
                        {contact.wechat}
                    </span>
                </div>
                <div className="group flex flex-col gap-1 rounded-xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/30 px-4 py-3 transition-all duration-200 hover:border-slate-300/80 hover:shadow-sm dark:border-slate-800/40 dark:from-slate-900/80 dark:to-slate-950/80 dark:hover:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.phone")}</span>
                    <span className="min-w-0 break-all font-mono text-sm text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400 sm:text-right">
                        {contact.phone}
                    </span>
                </div>
                <div className="group flex flex-col gap-1 rounded-xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/30 px-4 py-3 transition-all duration-200 hover:border-slate-300/80 hover:shadow-sm dark:border-slate-800/40 dark:from-slate-900/80 dark:to-slate-950/80 dark:hover:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.github")}</span>
                    <ExternalLink href={contact.github}>{t("actions.open")}</ExternalLink>
                </div>
                <div className="group flex flex-col gap-1 rounded-xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/30 px-4 py-3 transition-all duration-200 hover:border-slate-300/80 hover:shadow-sm dark:border-slate-800/40 dark:from-slate-900/80 dark:to-slate-950/80 dark:hover:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <span className="text-slate-600 dark:text-slate-400">{t("contact.linkedin")}</span>
                    <ExternalLink href={contact.linkedin}>{t("actions.open")}</ExternalLink>
                </div>
            </div>
        </Card>
    );
}
