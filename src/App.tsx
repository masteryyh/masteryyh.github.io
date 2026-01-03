import { Badge } from './components/Badge'
import { Card } from './components/Card'
import { Section } from './components/Section'
import { Terminal } from './components/Terminal'
import type { ReactNode } from 'react'
import { LANG_LABEL, SUPPORTED_LANGS, type Lang } from './i18n'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const PROFILE = {
    name: 'Yanhong Yang (杨雁鸿)',
    contact: {
        email: 'yyh991013@163.com',
        emailAlt: 'yyh991013@gmail.com',
        wechat: 'masteryyh',
        phone: '+86 15616700368',
        linkedin: 'https://www.linkedin.com/in/masteryyh',
        credly: 'https://www.credly.com/users/masteryyh',
    },
}

const ABOUT: Record<Lang, string[]> = {
    'zh-CN': [
        '后端 / 全栈工程师，偏爱可观测性（logs/metrics/traces）与可运维性。',
        'DevOps 工程师：CI/CD、容器化与基础设施自动化。',
        'Homelab 爱好者，喜欢折腾自托管服务与家庭网络。',
        '曾就职于 SUSE / Rancher（公开信息来源：GitHub README）。',
    ],
    en: [
        'Backend / full-stack engineer with a focus on observability (logs/metrics/traces) and operability.',
        'DevOps engineer: CI/CD, containers, and infrastructure automation.',
        'Homelab enthusiast who enjoys self-hosting and home networking.',
        'Former employee of SUSE / Rancher (public info from GitHub README).',
    ],
}

const CERTS = [
    {
        name: 'CKA',
        issuer: 'Credly',
        year: '—',
        href: PROFILE.contact.credly,
    },
    {
        name: 'CKAD',
        issuer: 'Credly',
        year: '—',
        href: PROFILE.contact.credly,
    },
]

const STACK = {
    Languages: ['Go', 'Java', 'Python', 'TypeScript', 'SQL'],
    Backend: ['REST', 'gRPC', 'Kafka', 'Redis', 'PostgreSQL', 'MySQL'],
    Cloud: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Observability'],
    Frontend: ['React', 'Vite', 'Tailwind CSS'],
}

const INTERESTS: Record<Lang, string[]> = {
    'zh-CN': [
        '系统设计与性能优化',
        '工程效率（DX）与工具链',
        'Homelab / 自托管服务',
        '猫猫友好（Friend of a cat）',
    ],
    en: [
        'System design & performance tuning',
        'Developer experience (DX) & tooling',
        'Homelab / self-hosting',
        'Friend of a cat',
    ],
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4 decoration-emerald-500/40 hover:decoration-emerald-400/50 transition-colors"
        >
            {children}
        </a>
    )
}

function App() {
    const { t, i18n } = useTranslation()
    const lang: Lang = i18n.resolvedLanguage === 'zh-CN' ? 'zh-CN' : 'en'

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
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                                    {PROFILE.name}{' '}
                                </h1>
                                <Badge tone="accent">{t('roles.backendFullstack')}</Badge>
                                <Badge tone="neutral">{t('roles.devOps')}</Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                {SUPPORTED_LANGS.map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => void i18n.changeLanguage(l)}
                                        className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                                            lang === l
                                                ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                                                : 'border-slate-800/70 bg-slate-950/40 text-slate-300 hover:border-slate-700/70'
                                        }`}
                                    >
                                        {LANG_LABEL[l]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p className="text-balance text-sm leading-relaxed text-slate-300">
                            {t('header.tagline')}
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Terminal
                            title="~/portfolio"
                            name={PROFILE.name}
                            statusText={t('terminal.status')}
                            line2={t('terminal.line2')}
                            contact={PROFILE.contact}
                        />

                        <Card className="transition-transform duration-300 hover:-translate-y-0.5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-100">{t('contact.title')}</h3>
                                </div>
                                <Badge tone="neutral">UTC+8</Badge>
                            </div>

                            <div className="mt-5 grid gap-3 text-sm">
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3">
                                    <span className="text-slate-400">{t('contact.email')}</span>
                                    <span className="font-mono text-slate-200">
                                        {PROFILE.contact.email}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3">
                                    <span className="text-slate-400">{t('contact.emailAlt')}</span>
                                    <span className="font-mono text-slate-200">
                                        {PROFILE.contact.emailAlt}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3">
                                    <span className="text-slate-400">{t('contact.wechat')}</span>
                                    <span className="font-mono text-slate-200">
                                        {PROFILE.contact.wechat}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3">
                                    <span className="text-slate-400">{t('contact.phone')}</span>
                                    <span className="font-mono text-slate-200">
                                        {PROFILE.contact.phone}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3">
                                    <span className="text-slate-400">{t('contact.linkedin')}</span>
                                    <ExternalLink href={PROFILE.contact.linkedin}>{t('actions.open')}</ExternalLink>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3">
                                    <span className="text-slate-400">{t('contact.credly')}</span>
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
                        <Card className="transition-transform duration-300 hover:-translate-y-0.5">
                            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                                {ABOUT[lang].map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </Card>
                    </Section>

                    <Section
                        id="certs"
                        title={t('cert.title')}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            {CERTS.map((c) => (
                                <Card
                                    key={c.name}
                                    className="transition-transform duration-300 hover:-translate-y-0.5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-100">{c.name}</div>
                                            <div className="mt-1 text-sm text-slate-400">
                                                {c.issuer} • {c.year}
                                            </div>
                                        </div>
                                        <Badge tone="accent">{t('cert.verified')}</Badge>
                                    </div>
                                    <div className="mt-4 text-sm">
                                        <ExternalLink href={c.href}>{t('cert.viewOnCredly')}</ExternalLink>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Section>

                    <Section
                        id="stack"
                        title={t('stack.title')}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            {Object.entries(STACK).map(([group, items]) => (
                                <Card
                                    key={group}
                                    className="transition-transform duration-300 hover:-translate-y-0.5"
                                >
                                    <div className="text-sm font-semibold text-slate-100">
                                        {group === 'Languages'
                                            ? t('stack.labels.languages')
                                            : group === 'Backend'
                                                ? t('stack.labels.backend')
                                                : group === 'Cloud'
                                                    ? t('stack.labels.cloud')
                                                    : group === 'Frontend'
                                                        ? t('stack.labels.frontend')
                                                        : group}
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
                        id="interests"
                        title={t('interests.title')}
                    >
                        <Card className="transition-transform duration-300 hover:-translate-y-0.5">
                            <ul className="grid list-disc gap-2 pl-5 text-sm text-slate-300 md:grid-cols-2">
                                {INTERESTS[lang].map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </Card>
                    </Section>
                </main>

                <footer className="mt-12 border-t border-slate-800/70 py-8 text-sm text-slate-400">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <span className="text-slate-300">{PROFILE.name}</span> • {t('footer.builtWith')}
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default App
