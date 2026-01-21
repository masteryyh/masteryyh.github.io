import type { Lang } from "../i18n";
import { LANG_LABEL, SUPPORTED_LANGS } from "../i18n";

type LanguageToggleProps = {
    value: Lang;
    onChange: (lang: Lang) => void;
    ariaLabel?: string;
    disabled?: boolean;
};

const segmentedContainerClassName =
    "inline-flex h-9 items-center rounded-lg border border-slate-200/70 bg-white/70 p-0.5 shadow-sm backdrop-blur-sm ring-1 ring-transparent dark:border-slate-700/60 dark:bg-slate-900/70";

function segmentButtonClass(active: boolean) {
    return `rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-emerald-500/40 ${
        active
            ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md ring-1 ring-slate-900/20 dark:from-slate-100 dark:to-slate-200 dark:text-slate-900 dark:ring-slate-100/20"
            : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
    }`;
}

export function LanguageToggle({ value, onChange, ariaLabel = "Language", disabled }: LanguageToggleProps) {
    return (
        <div className={segmentedContainerClassName} role="radiogroup" aria-label={ariaLabel} aria-disabled={disabled}>
            {SUPPORTED_LANGS.map((l) => {
                const active = l === value;
                return (
                    <button
                        key={l}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={disabled}
                        onClick={() => {
                            if (active) return;
                            onChange(l);
                        }}
                        className={segmentButtonClass(active)}
                    >
                        {LANG_LABEL[l]}
                    </button>
                );
            })}
        </div>
    );
}
