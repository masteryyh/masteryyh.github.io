import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleHalfStroke, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

import { useTheme } from '../theme/useTheme'
import type { ThemePreference } from '../theme/themeContext'
import { useTranslation } from 'react-i18next'

const preferenceMeta: Record<ThemePreference, { title: string; label: string }> = {
    system: { title: 'colorMode.system', label: 'colorMode.system' },
    light: { title: 'colorMode.light', label: 'colorMode.light' },
    dark: { title: 'colorMode.dark', label: 'colorMode.dark' },
}

function iconState(active: boolean) {
    return active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
}

export function ThemeToggle() {
    const { preference, cyclePreference } = useTheme()
    const { t } = useTranslation()
    const meta = preferenceMeta[preference]
    const label = t(meta.label)
    const ariaLabel = t('colorMode.ariaLabel', { mode: label })

    return (
        <button
            type="button"
            title={ariaLabel}
            aria-label={ariaLabel}
            onClick={cyclePreference}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-white dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-950/60"
        >
            <span className="relative inline-block h-4 w-4">
                <span
                    className={`absolute inset-0 flex items-center justify-center text-slate-700 transition-[opacity,transform] duration-250 ease-in-out dark:text-slate-200 ${iconState(
                        preference === 'system',
                    )}`}
                >
                    <FontAwesomeIcon icon={faCircleHalfStroke} />
                </span>
                <span
                    className={`absolute inset-0 flex items-center justify-center text-amber-600 transition-[opacity,transform] duration-250 ease-in-out dark:text-amber-300 ${iconState(
                        preference === 'light',
                    )}`}
                >
                    <FontAwesomeIcon icon={faSun} />
                </span>
                <span
                    className={`absolute inset-0 flex items-center justify-center text-slate-700 transition-[opacity,transform] duration-250 ease-in-out dark:text-slate-200 ${iconState(
                        preference === 'dark',
                    )}`}
                >
                    <FontAwesomeIcon icon={faMoon} />
                </span>
            </span>

            <span className="hidden w-12 justify-center sm:inline-flex">{label}</span>
        </button>
    )
}
