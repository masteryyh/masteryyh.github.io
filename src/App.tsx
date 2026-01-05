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

const PROFILE = {
    name: "Yanhong Yang (杨雁鸿)",
    contact: {
        email: "yyh991013@163.com",
        wechat: "masteryyh",
        phone: "+86 15616700368",
        github: "https://github.com/masteryyh",
        linkedin: "https://www.linkedin.com/in/masteryyh",
    },
};

const CERTS = [
    {
        name: "CKA (Certified Kubernetes Administrator)",
        issuer: "cert.linuxFoundation",
        year: "2024",
        href: "https://www.credly.com/badges/0289e078-1df9-40d2-8265-927291ec01c7",
    },
    {
        name: "CKAD (Certified Kubernetes Application Developer)",
        issuer: "cert.linuxFoundation",
        year: "2024",
        href: "https://www.credly.com/badges/3b4a475d-5909-48da-9bbf-2f4c62dac25c",
    },
    {
        name: "CKS (Certified Kubernetes Security Specialist)",
        issuer: "cert.linuxFoundation",
        year: "2024",
        href: "https://www.credly.com/badges/771f5a45-c6d4-4da1-a559-09e15e9a5326",
    },
];

const STACK = {
    "stack.labels.languagesFrameworks": [
        "Go",
        "Gin",
        "GORM",
        "Java",
        "Spring Boot",
        "JavaScript / TypeScript",
        "SQL",
    ],
    "stack.labels.dbMiddlewares": [
        "Redis",
        "PostgreSQL",
        "MySQL",
        "RabbitMQ",
        "MongoDB",
        "Elasticsearch",
    ],
    "stack.labels.cloud": [
        "Docker",
        "Kubernetes",
        "KVM",
        "CI/CD",
        "Linux",
        "Prometheus",
        "Grafana",
        "Rancher",
    ],
    "stack.labels.frontendFullstack": ["React", "NextJS", "Vite", "Tailwind CSS"],
};

function App() {
    const { t, i18n } = useTranslation();
    const lang: Lang = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";
    const [scrolled, setScrolled] = useState(false);
    const [activePath, setActivePath] = useState<string>("");

    const aboutItems = t("about.items", { returnObjects: true });
    const aboutList: string[] = Array.isArray(aboutItems)
        ? aboutItems.filter((it): it is string => typeof it === "string")
        : [];

    useEffect(() => {
        document.title = t("meta.title", { name: PROFILE.name });
    }, [lang, t]);

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
                                    {PROFILE.name}
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
                            name={PROFILE.name}
                            line2={t("terminal.line2")}
                            contact={PROFILE.contact}
                        />

                        <ContactCard contact={PROFILE.contact} />
                    </div>
                </header>

                <main className="mt-9 grid gap-8 sm:mt-10 sm:gap-10">
                    <AboutSection title={t("about.title")} items={aboutList} />

                    <StackSection
                        title={t("stack.title")}
                        groups={Object.entries(STACK).map(([group, items]) => ({
                            title: t(group),
                            items,
                        }))}
                    />

                    <CertsSection
                        title={t("cert.title")}
                        validLabel={t("cert.valid")}
                        viewLabel={t("cert.viewOnCredly")}
                        certs={CERTS.map((c) => ({
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
