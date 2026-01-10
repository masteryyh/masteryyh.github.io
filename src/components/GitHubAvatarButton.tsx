import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGitHubAuth } from "../auth/githubAuthContext";

function EmptyAvatarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path
                d="M12 12a4.25 4.25 0 1 0-4.25-4.25A4.25 4.25 0 0 0 12 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M4.5 20.25c1.6-3.4 4.3-5.1 7.5-5.1s5.9 1.7 7.5 5.1"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function GitHubAvatarButton() {
    const { t } = useTranslation();
    const { user, isReady, login, logout } = useGitHubAuth();
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const title = !isReady
        ? t("auth.github.loading", { defaultValue: "Loading…" })
        : !user
            ? t("auth.github.login", { defaultValue: "Login with GitHub" })
            : t("auth.github.loggedInAs", { defaultValue: "Logged in as {{login}}", login: user.login });

    const onClick = () => {
        if (!user) {
            login();
            return;
        }
        setOpen((v) => !v);
    };

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e: PointerEvent) => {
            const root = rootRef.current;
            if (!root) return;
            if (e.target instanceof Node && root.contains(e.target)) return;
            setOpen(false);
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("pointerdown", onPointerDown, { capture: true });
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("pointerdown", onPointerDown, { capture: true });
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <div className="relative isolate z-50" ref={rootRef}>
            <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-white/55 text-slate-700 shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-200 hover:bg-white/80 hover:shadow dark:border-slate-800/70 dark:bg-slate-950/35 dark:text-slate-200 dark:hover:bg-slate-950/55 active:scale-[0.97]"
                aria-label={title}
                title={title}
                aria-haspopup={user ? "menu" : undefined}
                aria-expanded={user ? open : undefined}
                onClick={onClick}
            >
                {user ? (
                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <EmptyAvatarIcon />
                )}
            </button>

            {user && open ? (
                <div
                    role="menu"
                    aria-label={t("auth.github.menuLabel", { defaultValue: "GitHub account menu" })}
                    className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200/70 bg-white/90 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/70"
                >
                    <button
                        type="button"
                        role="menuitem"
                        className="w-full px-3 py-2.5 text-left text-sm font-medium text-rose-700 hover:bg-rose-50/70 dark:text-rose-300 dark:hover:bg-rose-950/35"
                        onClick={() => {
                            setOpen(false);
                            logout();
                        }}
                    >
                        {t("auth.github.logout", { defaultValue: "Logout" })}
                    </button>
                </div>
            ) : null}
        </div>
    );
}
