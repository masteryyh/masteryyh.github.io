import { Terminal } from "../components/Terminal";
import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { AboutSection } from "../components/AboutSection";
import { StackSection } from "../components/StackSection";
import { CertsSection } from "../components/CertsSection";
import { ContactCard } from "../components/ContactCard";
import { CERTS, PROFILE, TECH_STACKS } from "../consts/consts";
import { SocialButtons } from "../components/SocialButtons";
import { GitHubAvatarButton } from "../components/GitHubAvatarButton";
import { BlogSection } from "../blog/components/BlogSection";
import { PageLayout, type LayoutContext } from "../components/PageLayout";

export function HomePage() {
    const [activePath, setActivePath] = useState<string>("");

    const sections = useMemo(
        () => [
            { id: "about", segment: "about" },
            { id: "stack", segment: "tech-stacks" },
            { id: "certs", segment: "certificates" },
        ],
        [],
    );

    useEffect(() => {
        let rafId = 0;

        function updateActivePath() {
            const anchorY = 120;
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

        function onScroll() {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                rafId = 0;
                updateActivePath();
            });
        }

        updateActivePath();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [sections]);

    return (
        <PageLayout activePath={activePath}>
            {(ctx) => <HomePageContent {...ctx} />}
        </PageLayout>
    );
}

function HomePageContent({ t, lang, scrolled, handleLangChange, languageSwitching }: LayoutContext) {
    const aboutList = useMemo(() => {
        const items = t("about.items", { returnObjects: true });
        return Array.isArray(items) ? items.filter((it): it is string => typeof it === "string") : [];
    }, [t]);

    const stackGroups = useMemo(
        () => Object.entries(TECH_STACKS).map(([group, items]) => ({
            title: t(group),
            items,
        })),
        [t],
    );

    const certsList = useMemo(
        () => CERTS.map((c) => ({
            name: c.name,
            issuer: `${t(c.issuer)}`,
            year: c.year,
            href: c.href,
        })),
        [t],
    );

    return (
        <>
            <HomeTitle lang={lang} t={t} />

            <header className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="break-words font-mono text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                                {PROFILE.name}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-accent">
                                    @masteryyh
                                </span>
                                <span
                                    className="h-1 w-1 rounded-full bg-text-muted"
                                    aria-hidden="true"
                                />
                                <span className="text-sm text-text-secondary">
                                    {t("header.tagline")}
                                </span>
                            </div>
                        </div>

                        {!scrolled ? (
                            <div className="hidden items-center gap-2 sm:flex">
                                <SocialButtons linkedInUrl={PROFILE.contact.linkedin} className="flex" lang={lang} />

                                <ThemeToggle />

                                <div className="hidden sm:block">
                                    <LanguageToggle
                                        value={lang}
                                        onChange={handleLangChange}
                                        disabled={languageSwitching}
                                    />
                                </div>

                                <GitHubAvatarButton />
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="lg:relative">
                        <div className="lg:absolute lg:inset-0">
                            <Terminal
                                title="~/portfolio"
                                name={PROFILE.name}
                                line2={t("terminal.line2")}
                                contact={PROFILE.contact}
                            />
                        </div>
                    </div>

                    <ContactCard contact={PROFILE.contact} />
                </div>
            </header>

            <main className="mt-9 grid gap-8 sm:mt-10 sm:gap-10">
                <AboutSection title={t("about.title")} items={aboutList} />

                <StackSection title={t("stack.title")} groups={stackGroups} />

                <CertsSection
                    title={t("cert.title")}
                    validLabel={t("cert.valid")}
                    viewLabel={t("cert.viewOnCredly")}
                    certs={certsList}
                />

                <BlogSection />
            </main>
        </>
    );
}

function HomeTitle({ lang, t }: { lang: string; t: (key: string, opts?: Record<string, unknown>) => string }) {
    useEffect(() => {
        document.title = t("meta.title", { name: PROFILE.name });
    }, [lang, t]);
    return null;
}
