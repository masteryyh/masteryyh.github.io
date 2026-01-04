import { createContext } from "react";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export type ThemeContextValue = {
    preference: ThemePreference;
    resolvedTheme: ResolvedTheme;
    setPreference: (pref: ThemePreference) => void;
    cyclePreference: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
