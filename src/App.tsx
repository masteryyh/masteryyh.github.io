import { Terminal } from "./components/Terminal";
import { ThemeToggle } from "./components/ThemeToggle";
import type { Lang } from "./i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HeaderBar } from "./components/HeaderBar";
import { AboutSection } from "./components/AboutSection";
import { StackSection } from "./components/StackSection";
import { CertsSection } from "./components/CertsSection";
import { LanguageToggle } from "./components/LanguageToggle";
import { ContactCard } from "./components/ContactCard";

type Contact = {
    email: string;
    wechat: string;
    phone: string;
    github: string;
    linkedin: string;
};

type Profile = {
    name: string;
    contact: Contact;
};

type Cert = {
    name: string;
    issuer: string;
    year: string;
    href: string;
};

type TechStack = Record<string, string[]>;

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal });
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
}

function App() {
    const { t, i18n } = useTranslation();
    const lang: Lang = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";
    const [scrolled, setScrolled] = useState(false);
    const [activePath, setActivePath] = useState<string>("");

    const [profile, setProfile] = useState<Profile | null>(null);
    const [certs, setCerts] = useState<Cert[] | null>(null);
    const [techStack, setTechStack] = useState<TechStack | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const handleRetry = () => {
        setError(null);
        setProfile(null);
        setCerts(null);
        setTechStack(null);
        setRetryCount((prev) => prev + 1);
    };

    const aboutItems = t("about.items", { returnObjects: true });
    const aboutList: string[] = Array.isArray(aboutItems)
        ? aboutItems.filter((it): it is string => typeof it === "string")
        : [];

    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL;
        const infoUrl = `${baseUrl}assets/info.json`;
        const certsUrl = `${baseUrl}assets/certs.json`;
        const techStacksUrl = `${baseUrl}assets/techStacks.json`;

        const abortController = new AbortController();

        async function loadData() {
            try {
                const [nextProfile, nextCerts, nextTechStack] = await Promise.all([
                    fetchJson<Profile>(infoUrl, abortController.signal),
                    fetchJson<Cert[]>(certsUrl, abortController.signal),
                    fetchJson<TechStack>(techStacksUrl, abortController.signal),
                ]);

                if (!abortController.signal.aborted) {
                    setProfile(nextProfile);
                    setCerts(nextCerts);
                    setTechStack(nextTechStack);
                }
            } catch (e) {
                if (!abortController.signal.aborted) {
                    console.error(e);
                    setError(e instanceof Error ? e : new Error(String(e)));
                }
            }
        }

        loadData();

        return () => {
            abortController.abort();
        };
    }, [retryCount]);

    useEffect(() => {
        if (!profile) return;
        document.title = t("meta.title", { name: profile.name });
    }, [lang, profile, t]);

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 8);

            const anchorY = 120;
            const sections: Array<{ id: string; segment: string }> = [
                { id: "about", segment: "about" },
                { id: "stack", segment: "tech-stacks" },
                { id: "certs", segment: "certificates" },
            ];

            let nextPath = "";
            for (const s of sections) {
                const el = document.getElementById(s.id);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= anchorY && rect.bottom > anchorY) {
                    nextPath = `/${s.segment}`;
                    break;
                }
            }

            setActivePath(nextPath);
        }

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (error) {
        return (
            <div className="min-h-dvh relative">
                <div className="bg-grid" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="mx-4 flex max-w-md flex-col items-center gap-4 text-center">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                                {t("error.title")}
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                {t("error.message")}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
                        >
                            {t("error.retry")}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile || !certs || !techStack) {
        return (
            <div className="min-h-dvh relative" aria-busy="true">
                <div className="bg-grid" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4" role="status">
                        <div
                            className="h-12 w-12 animate-spin rounded-full border-2 border-slate-400 border-t-transparent dark:border-slate-500 dark:border-t-transparent"
                            aria-hidden="true"
                        />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300" aria-live="polite">
                            {t("loading")}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh">
            <div className="bg-grid" />

            <HeaderBar
                scrolled={scrolled}
                activePath={activePath}
                lang={lang}
                onLangChange={(l) => i18n.changeLanguage(l)}
            />

            <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
                <header className="flex flex-col gap-7">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                                    {profile.name}
                                </h1>
                                <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                                    @masteryyh
                                </span>
                            </div>

                            {!scrolled ? (
                                <div className="hidden items-center gap-2 sm:flex">
                                    <ThemeToggle />
                                    <LanguageToggle value={lang} onChange={(l) => i18n.changeLanguage(l)} />
                                </div>
                            ) : null}
                        </div>

                        <p className="text-balance text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                            {t("header.tagline")}
                        </p>
                    </div>

                    <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                        <Terminal
                            title="~/portfolio"
                            name={profile.name}
                            line2={t("terminal.line2")}
                            contact={profile.contact}
                        />

                        <ContactCard contact={profile.contact} />
                    </div>
                </header>

                <main className="mt-9 grid gap-8 sm:mt-10 sm:gap-10">
                    <AboutSection title={t("about.title")} items={aboutList} />

                    <StackSection
                        title={t("stack.title")}
                        groups={Object.entries(techStack).map(([group, items]) => ({
                            title: t(group),
                            items,
                        }))}
                    />

                    <CertsSection
                        title={t("cert.title")}
                        validLabel={t("cert.valid")}
                        viewLabel={t("cert.viewOnCredly")}
                        certs={certs.map((c) => ({
                            name: c.name,
                            issuer: `${t(c.issuer)}`,
                            year: c.year,
                            href: c.href,
                        }))}
                    />
                </main>

                <footer className="mt-12 border-t border-slate-200 py-6 text-xs text-slate-600 dark:border-slate-800/70 dark:text-slate-400 sm:py-8 sm:text-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="text-slate-900 dark:text-slate-300">masteryyh</span> • {t("footer.builtWith")}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default App;
