import { useEffect, useMemo, useState, type ReactNode } from "react";

import { ThemeContext, type ResolvedTheme, type ThemeContextValue, type ThemePreference } from "./themeContext";

const THEME_STORAGE_KEY = "theme";

function isThemePreference(value: unknown): value is ThemePreference {
    return value === "system" || value === "light" || value === "dark";
}

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") return "light";
    if (!window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyResolvedTheme(theme: ResolvedTheme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const meta = document.querySelector("meta[name=\"theme-color\"]") as HTMLMetaElement | null;
    if (meta) {
        meta.content = theme === "dark" ? "#002b36" : "#fdf6e3";
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [preference, setPreference] = useState<ThemePreference>(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return isThemePreference(stored) ? stored : "system";
    });

    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);
    const resolvedTheme: ResolvedTheme = preference === "system" ? systemTheme : preference;

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, preference);
    }, [preference]);

    useEffect(() => {
        applyResolvedTheme(resolvedTheme);
    }, [resolvedTheme]);

    useEffect(() => {
        if (preference !== "system") return;
        if (!window.matchMedia) return;

        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => {
            setSystemTheme(mql.matches ? "dark" : "light");
        };

        if (typeof mql.addEventListener === "function") {
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        }
        // Fallback for Safari < 14
        mql.addListener(onChange);
        return () => mql.removeListener(onChange);
    }, [preference]);

    const value = useMemo<ThemeContextValue>(
        () => ({
            preference,
            resolvedTheme,
            setPreference,
            cyclePreference: () => {
                setPreference((p) => (p === "system" ? "light" : p === "light" ? "dark" : "system"));
            },
        }),
        [preference, resolvedTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
