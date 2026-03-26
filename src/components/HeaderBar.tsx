import { useLayoutEffect, useRef, useState } from "react";

import { LANG_LABEL, SUPPORTED_LANGS, type Lang } from "../i18n";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { SocialButtons } from "./SocialButtons";
import { GitHubAvatarButton } from "./GitHubAvatarButton";

type HeaderBarProps = {
    scrolled: boolean;
    activePath: string;
    lang: Lang;
    onLangChange: (lang: Lang) => void;
    langDisabled?: boolean;
    basePath?: string;
    linkedInUrl?: string;
};

export function HeaderBar({
    scrolled,
    activePath,
    lang,
    onLangChange,
    langDisabled,
    basePath = "~/portfolio",
    linkedInUrl = "",
}: HeaderBarProps) {
    const lastPathRef = useRef(activePath);
    const [fromPath, setFromPath] = useState(activePath);
    const [isAnimating, setIsAnimating] = useState(false);
    const [transitionId, setTransitionId] = useState(0);

    useLayoutEffect(() => {
        if (activePath === lastPathRef.current) return;

        setFromPath(lastPathRef.current);
        setIsAnimating(true);
        setTransitionId((value) => value + 1);
        lastPathRef.current = activePath;
    }, [activePath]);

    const nextLang = (() => {
        const idx = SUPPORTED_LANGS.indexOf(lang);
        if (idx < 0) return SUPPORTED_LANGS[0];
        return SUPPORTED_LANGS[(idx + 1) % SUPPORTED_LANGS.length];
    })();

    return (
        <div
            className={`fixed left-0 right-0 top-0 z-40 w-full border-b transition-[transform,opacity,background-color,border-color] duration-200 ${
                scrolled
                    ? "pointer-events-auto translate-y-0 border-border bg-elevated opacity-100"
                    : "pointer-events-none -translate-y-2 border-transparent bg-transparent opacity-0"
            }`}
        >
            <div className="mx-auto w-full max-w-6xl px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex w-full items-center justify-between gap-3">
                    <div className="min-w-0 flex items-center gap-3">
                        <span className="min-w-0 max-w-[50vw] truncate font-mono text-xs text-text-secondary sm:max-w-none">
                            {isAnimating ? (
                                <span className="relative inline-grid">
                                    <span key={`out-${transitionId}`} className="col-start-1 row-start-1 path-fade-out">
                                        {basePath}
                                        {fromPath}
                                    </span>
                                    <span
                                        key={`in-${transitionId}`}
                                        className="col-start-1 row-start-1 path-fade-in"
                                        onAnimationEnd={() => setIsAnimating(false)}
                                    >
                                        {basePath}
                                        {activePath}
                                    </span>
                                </span>
                            ) : (
                                <>
                                    {basePath}
                                    {activePath}
                                </>
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <SocialButtons className="hidden sm:flex" linkedInUrl={linkedInUrl} lang={lang} />

                        <ThemeToggle />

                        <div className="hidden sm:block">
                            <LanguageToggle value={lang} onChange={onLangChange} disabled={langDisabled} />
                        </div>

                        <button
                            type="button"
                            className="inline-flex h-8 items-center justify-center rounded border border-border bg-surface px-2.5 font-mono text-xs font-medium text-text-secondary transition-colors duration-200 hover:border-border-hover hover:text-text-primary sm:hidden"
                            disabled={langDisabled}
                            aria-label={`Switch language to ${LANG_LABEL[nextLang]}`}
                            title={`Switch to ${LANG_LABEL[nextLang]}`}
                            onClick={() => {
                                if (langDisabled) return;
                                if (nextLang === lang) return;
                                onLangChange(nextLang);
                            }}
                        >
                            {LANG_LABEL[lang]}
                        </button>

                        <GitHubAvatarButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
