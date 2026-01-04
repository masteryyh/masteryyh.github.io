import type { Lang } from "../i18n";
import { LANG_LABEL, SUPPORTED_LANGS } from "../i18n";

type LanguageToggleProps = {
    value: Lang;
    onChange: (lang: Lang) => void;
    ariaLabel?: string;
};

const segmentedContainerClassName =
    "inline-flex h-9 items-center rounded-lg border border-slate-200/80 bg-white/55 p-0.5 shadow-sm ring-1 ring-transparent dark:border-slate-800/70 dark:bg-slate-950/35";

function segmentButtonClass(active: boolean) {
    return `rounded-md px-2.5 py-1 text-xs font-semibold transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 dark:focus-visible:ring-emerald-300/30 ${
        active
            ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/20 dark:bg-slate-100 dark:text-slate-900 dark:ring-slate-100/20"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
    }`;
}

export function LanguageToggle({ value, onChange, ariaLabel = "Language" }: LanguageToggleProps) {
    return (
        <div className={segmentedContainerClassName} role="radiogroup" aria-label={ariaLabel}>
            {SUPPORTED_LANGS.map((l) => {
                const active = l === value;
                return (
                    <button
                        key={l}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(l)}
                        className={segmentButtonClass(active)}
                    >
                        {LANG_LABEL[l]}
                    </button>
                );
            })}
        </div>
    );
}
