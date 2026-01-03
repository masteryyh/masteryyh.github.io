import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export type Lang = 'zh-CN' | 'en'

export const SUPPORTED_LANGS: Lang[] = ['zh-CN', 'en']

export const LANG_LABEL: Record<Lang, string> = {
    'zh-CN': '简体中文',
    en: 'EN',
}

export function isLang(value: unknown): value is Lang {
    return value === 'zh-CN' || value === 'en'
}

export function getInitialLang(): Lang {
    const stored = localStorage.getItem('lang')
    if (isLang(stored)) return stored

    const nav = navigator.language
    if (nav && nav.toLowerCase().startsWith('zh')) return 'zh-CN'
    return 'en'
}

const resources = {
    'zh-CN': {
        translation: {
            meta: {
                title: '{{name}} · 个人主页',
            },
            roles: {
                backendFullstack: '后端 / 全栈',
                devOps: 'DevOps',
            },
            header: {
                tagline: '后端优先，全栈可用；偏爱可观测性、可靠性与干净的 API 设计。',
            },
            actions: {
                open: '打开',
            },
            contact: {
                title: '联系方式',
                email: '邮箱',
                emailAlt: '备用邮箱',
                phone: '手机号',
                wechat: '微信',
                linkedin: 'LinkedIn',
                credly: 'Credly',
            },
            about: {
                title: '关于我',
            },
            cert: {
                title: '证书',
                verified: '已验证',
                viewOnCredly: '在 Credly 查看',
            },
            stack: {
                title: '技术栈',
                labels: {
                    languages: '语言',
                    backend: '后端',
                    cloud: '云原生 / 运维',
                    frontend: '前端',
                },
            },
            interests: {
                title: '兴趣',
            },
            footer: {
                builtWith: '使用 Vite + React + TypeScript 构建',
            },
            terminal: {
                status: 'static build • CDN-ready • no runtime API',
                line2: '后端 / 全栈 • DevOps • 可靠系统',
            },
        },
    },
    en: {
        translation: {
            meta: {
                title: '{{name}} · Portfolio',
            },
            roles: {
                backendFullstack: 'Backend / Full-stack',
                devOps: 'DevOps',
            },
            header: {
                tagline: 'Backend-first, full-stack capable. Reliability, observability, and clean APIs.',
            },
            actions: {
                open: 'Open',
            },
            contact: {
                title: 'Contact',
                email: 'Email',
                emailAlt: 'Alt email',
                phone: 'Phone',
                wechat: 'WeChat',
                linkedin: 'LinkedIn',
                credly: 'Credly',
            },
            about: {
                title: 'About',
            },
            cert: {
                title: 'Certifications',
                verified: 'verified',
                viewOnCredly: 'View on Credly',
            },
            stack: {
                title: 'Tech stack',
                labels: {
                    languages: 'Languages',
                    backend: 'Backend',
                    cloud: 'Cloud / Ops',
                    frontend: 'Frontend',
                },
            },
            interests: {
                title: 'Interests',
            },
            footer: {
                builtWith: 'Built with Vite + React + TypeScript',
            },
            terminal: {
                status: 'static build • CDN-ready • no runtime API',
                line2: 'Backend / Full-stack • DevOps-minded • Reliable systems',
            },
        },
    },
} as const

void i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLang(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    })

i18n.on('languageChanged', (lng) => {
    if (isLang(lng)) {
        document.documentElement.lang = lng
        localStorage.setItem('lang', lng)
    }
})

export default i18n
