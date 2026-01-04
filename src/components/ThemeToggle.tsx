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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/55 text-slate-700 shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-200 hover:bg-white/80 hover:shadow dark:border-slate-800/70 dark:bg-slate-950/35 dark:text-slate-200 dark:hover:bg-slate-950/55 active:scale-[0.97]"
        >
            <span className="relative inline-block h-4 w-4">
                <span
                    className={`absolute inset-0 flex items-center justify-center text-slate-700 transition-opacity duration-200 ease-out dark:text-slate-200 ${iconState(
                        preference === "system",
                    )}`}
                >
                    <FontAwesomeIcon icon={faCircleHalfStroke} />
                </span>
                <span
                    className={`absolute inset-0 flex items-center justify-center text-amber-600 transition-opacity duration-200 ease-out dark:text-amber-300 ${iconState(
                        preference === "light",
                    )}`}
                >
                    <FontAwesomeIcon icon={faSun} />
                </span>
                <span
                    className={`absolute inset-0 flex items-center justify-center text-slate-700 transition-opacity duration-200 ease-out dark:text-slate-200 ${iconState(
                        preference === "dark",
                    )}`}
                >
                    <FontAwesomeIcon icon={faMoon} />
                </span>
            </span>
        </button>
    );
}
