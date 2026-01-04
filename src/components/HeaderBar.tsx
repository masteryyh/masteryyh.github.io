import { useLayoutEffect, useRef, useState } from "react";

import type { Lang } from "../i18n";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

type HeaderBarProps = {
    scrolled: boolean;
    activePath: string;
    lang: Lang;
    onLangChange: (lang: Lang) => void;
    basePath?: string;
};

export function HeaderBar({
    scrolled,
    activePath,
    lang,
    onLangChange,
    basePath = "~/portfolio",
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

    return (
        <div
            className={`fixed left-0 right-0 top-0 z-40 w-full transition-[opacity,background-color,border-color] duration-200 ${
                scrolled
                    ? "opacity-100 border-b border-slate-200/70 bg-white/65 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/45"
                    : "pointer-events-none opacity-0 border-b border-transparent bg-transparent"
            }`}
        >
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 font-mono text-xs text-slate-600 dark:text-slate-300">
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
                    <ThemeToggle />
                    <LanguageToggle value={lang} onChange={onLangChange} />
                </div>
            </div>
        </div>
    );
}
