import type { Lang } from "../i18n";
import { LANG_LABEL, SUPPORTED_LANGS } from "../i18n";

type LanguageToggleProps = {
    value: Lang;
    onChange: (lang: Lang) => void;
    ariaLabel?: string;
    disabled?: boolean;
};

function segmentButtonClass(active: boolean) {
    return `rounded px-2.5 py-1 font-mono text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${
        active
            ? "bg-text-primary text-[var(--color-bg)]"
            : "text-text-muted hover:text-text-primary"
    }`;
}

export function LanguageToggle({ value, onChange, ariaLabel = "Language", disabled }: LanguageToggleProps) {
    return (
        <div
            className="inline-flex h-8 items-center rounded border border-border bg-surface p-0.5"
            role="radiogroup"
            aria-label={ariaLabel}
            aria-disabled={disabled}
        >
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
