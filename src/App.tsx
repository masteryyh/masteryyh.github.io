import { Badge } from './components/Badge'
import { Card } from './components/Card'
import { Section } from './components/Section'
import { Terminal } from './components/Terminal'
import { ThemeToggle } from './components/ThemeToggle'
import type { ReactNode } from 'react'
import { LANG_LABEL, SUPPORTED_LANGS, type Lang } from './i18n'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const PROFILE = {
    name: 'Yanhong Yang (杨雁鸿)',
    contact: {
        email: 'yyh991013@163.com',
        wechat: 'masteryyh',
        phone: '+86 15616700368',
        github: 'https://github.com/masteryyh',
        linkedin: 'https://www.linkedin.com/in/masteryyh',
        credly: 'https://www.credly.com/users/masteryyh',
    },
}


const CERTS = [
    {
        name: 'CKA (Certified Kubernetes Administrator)',
        issuer: 'cert.linuxFoundation',
        year: '2024',
        href: 'https://www.credly.com/badges/0289e078-1df9-40d2-8265-927291ec01c7',
    },
    {
        name: 'CKAD (Certified Kubernetes Application Developer)',
        issuer: 'cert.linuxFoundation',
        year: '2024',
        href: 'https://www.credly.com/badges/3b4a475d-5909-48da-9bbf-2f4c62dac25c',
    },
    {
        name: 'CKS (Certified Kubernetes Security Specialist)',
        issuer: 'cert.linuxFoundation',
        year: '2024',
        href: 'https://www.credly.com/badges/771f5a45-c6d4-4da1-a559-09e15e9a5326',
    }
]

const STACK = {
    'stack.labels.languagesFrameworks': ['Go', 'Gin', 'GORM', 'Java', 'Spring Boot', 'JavaScript / TypeScript', 'SQL'],
    'stack.labels.dbMiddlewares': ['Redis', 'PostgreSQL', 'MySQL', 'RabbitMQ', 'MongoDB', 'Elasticsearch'],
    'stack.labels.cloud': ['Docker', 'Kubernetes', 'KVM', 'CI/CD', 'Linux', 'Prometheus', 'Grafana'],
    'stack.labels.frontendFullstack': ['React', 'NextJS', 'Vite', 'Tailwind CSS'],
}


function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:text-emerald-800 underline underline-offset-4 decoration-emerald-600/30 hover:decoration-emerald-600/40 transition-colors dark:text-emerald-300 dark:hover:text-emerald-200 dark:decoration-emerald-500/40 dark:hover:decoration-emerald-400/50"
        >
            {children}
        </a>
    )
}

function App() {
    const { t, i18n } = useTranslation()
    const lang: Lang = i18n.resolvedLanguage === 'zh-CN' ? 'zh-CN' : 'en'

    const aboutItems = t('about.items', { returnObjects: true })
    const aboutList: string[] = Array.isArray(aboutItems)
        ? aboutItems.filter((it): it is string => typeof it === 'string')
        : []

    useEffect(() => {
        document.title = t('meta.title', { name: PROFILE.name })
    }, [lang, t])

    return (
        <div className="min-h-dvh">
            <div className="bg-grid" />

            <div className="mx-auto w-full max-w-5xl px-5 py-10">
                <header className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                                    {PROFILE.name}{' '}
                                </h1>
                                <Badge tone="accent">{t('roles.backend')}</Badge>
                                <Badge tone="warn">{t('roles.fullstack')}</Badge>
                                <Badge tone="neutral">{t('roles.devOps')}</Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <label className="sr-only" htmlFor="lang">
                                    Language
                                </label>
                                <select
                                    id="lang"
                                    value={lang}
                                    onChange={(e) => void i18n.changeLanguage(e.target.value)}
                                    className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-white dark:border-slate-800/70 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-950/60"
                                >
                                    {SUPPORTED_LANGS.map((l) => (
                                        <option key={l} value={l}>
                                            {LANG_LABEL[l]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <p className="text-balance text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {t('header.tagline')}
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Terminal
                            title="~/portfolio"
                            name={PROFILE.name}
                            line2={t('terminal.line2')}
                            contact={PROFILE.contact}
                        />

                        <Card>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('contact.title')}</h3>
                                </div>
                                <Badge tone="neutral">UTC+8</Badge>
                            </div>

                            <div className="mt-5 grid gap-3 text-sm">
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                                    <span className="text-slate-600 dark:text-slate-400">{t('contact.email')}</span>
                                    <span className="font-mono text-slate-900 dark:text-slate-200">
                                        {PROFILE.contact.email}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                                    <span className="text-slate-600 dark:text-slate-400">{t('contact.wechat')}</span>
                                    <span className="font-mono text-slate-900 dark:text-slate-200">
                                        {PROFILE.contact.wechat}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                                    <span className="text-slate-600 dark:text-slate-400">{t('contact.phone')}</span>
                                    <span className="font-mono text-slate-900 dark:text-slate-200">
                                        {PROFILE.contact.phone}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                                    <span className="text-slate-600 dark:text-slate-400">{t('contact.github')}</span>
                                    <ExternalLink href={PROFILE.contact.github}>{t('actions.open')}</ExternalLink>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                                    <span className="text-slate-600 dark:text-slate-400">{t('contact.linkedin')}</span>
                                    <ExternalLink href={PROFILE.contact.linkedin}>{t('actions.open')}</ExternalLink>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-950/40">
                                    <span className="text-slate-600 dark:text-slate-400">{t('contact.credly')}</span>
                                    <ExternalLink href={PROFILE.contact.credly}>{t('actions.open')}</ExternalLink>
                                </div>
                            </div>
                        </Card>
                    </div>
                </header>

                <main className="mt-10 grid gap-10">
                    <Section
                        id="about"
                        title={t('about.title')}
                    >
                        <Card>
                            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
                                {aboutList.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </Card>
                    </Section>

                    <Section
                        id="stack"
                        title={t('stack.title')}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            {Object.entries(STACK).map(([group, items]) => (
                                <Card
                                    key={group}
                                >
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {t(group)}
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {items.map((it) => (
                                            <Badge
                                                key={it}
                                                tone={group === 'Backend' ? 'accent' : 'neutral'}
                                            >
                                                {it}
                                            </Badge>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Section>

                    <Section
                        id="certs"
                        title={t('cert.title')}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            {CERTS.map((c) => (
                                <Card
                                    key={c.name}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
                                            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                                {t(c.issuer)} • {c.year}
                                            </div>
                                        </div>
                                        <Badge tone="accent">{t('cert.valid')}</Badge>
                                    </div>
                                    <div className="mt-4 text-sm">
                                        <ExternalLink href={c.href}>{t('cert.viewOnCredly')}</ExternalLink>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Section>
                </main>

                <footer className="mt-12 border-t border-slate-200 py-8 text-sm text-slate-600 dark:border-slate-800/70 dark:text-slate-400">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="text-slate-900 dark:text-slate-300">masteryyh</span> • {t('footer.builtWith')}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default App
