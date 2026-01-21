import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import { useTheme } from "../theme/useTheme";
import type { ThemePreference } from "../theme/themeContext";
import { useTranslation } from "react-i18next";

const preferenceMeta: Record<ThemePreference, { title: string; label: string }> = {
    system: { title: "colorMode.system", label: "colorMode.system" },
    light: { title: "colorMode.light", label: "colorMode.light" },
    dark: { title: "colorMode.dark", label: "colorMode.dark" },
};

function iconState(active: boolean) {
    return active ? "opacity-100" : "opacity-0";
}

export function ThemeToggle() {
    const { preference, cyclePreference } = useTheme();
    const { t } = useTranslation();
    const meta = preferenceMeta[preference];
    const label = t(meta.label);
    const ariaLabel = t("colorMode.ariaLabel", { mode: label });

    return (
        <button
            type="button"
            title={ariaLabel}
            aria-label={ariaLabel}
            onClick={cyclePreference}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-slate-300 hover:bg-white hover:shadow-md active:scale-95 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
        >
            <span className="relative inline-block h-4 w-4">
                <span
                    className={`absolute inset-0 flex items-center justify-center text-slate-700 transition-opacity duration-200 ease-out dark:text-slate-200 ${iconState(
                        preference === "system",
                    )}`}
                    aria-hidden={preference !== "system"}
                >
                    <FontAwesomeIcon icon={faCircleHalfStroke} />
                </span>
                <span
                    className={`absolute inset-0 flex items-center justify-center text-amber-500 transition-opacity duration-200 ease-out dark:text-amber-400 ${iconState(
                        preference === "light",
                    )}`}
                    aria-hidden={preference !== "light"}
                >
                    <FontAwesomeIcon icon={faSun} />
                </span>
                <span
                    className={`absolute inset-0 flex items-center justify-center text-indigo-600 transition-opacity duration-200 ease-out dark:text-indigo-400 ${iconState(
                        preference === "dark",
                    )}`}
                    aria-hidden={preference !== "dark"}
                >
                    <FontAwesomeIcon icon={faMoon} />
                </span>
            </span>
        </button>
    );
}
