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
        meta.content = theme === "dark" ? "#020617" : "#f8fafc";
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [preference, setPreference] = useState<ThemePreference>(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return isThemePreference(stored) ? stored : "system";
    });

    const resolvedTheme: ResolvedTheme = useMemo(() => {
        return preference === "system" ? getSystemTheme() : preference;
    }, [preference]);

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
            applyResolvedTheme(mql.matches ? "dark" : "light");
        };

        // Safari compatibility
        if (typeof mql.addEventListener === "function") {
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        }

        // Legacy API
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
