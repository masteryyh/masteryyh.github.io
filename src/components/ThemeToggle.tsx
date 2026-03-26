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
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-secondary transition-colors duration-200 hover:border-border-hover hover:text-text-primary"
        >
            <span className="relative inline-block h-4 w-4">
                <span
                    className={`absolute inset-0 flex items-center justify-center text-text-secondary transition-opacity duration-200 ease-out ${iconState(
                        preference === "system",
                    )}`}
                    aria-hidden={preference !== "system"}
                >
                    <FontAwesomeIcon icon={faCircleHalfStroke} />
                </span>
                <span
                    className={`absolute inset-0 flex items-center justify-center text-accent transition-opacity duration-200 ease-out ${iconState(
                        preference === "light",
                    )}`}
                    aria-hidden={preference !== "light"}
                >
                    <FontAwesomeIcon icon={faSun} />
                </span>
                <span
                    className={`absolute inset-0 flex items-center justify-center text-info transition-opacity duration-200 ease-out ${iconState(
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
