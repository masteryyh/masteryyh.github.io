export type Lang = 'zh-CN' | 'en'

export const I18N_STORAGE_KEY = 'lang'

export const SUPPORTED_LANGS: Lang[] = ['zh-CN', 'en']

export const LANG_LABEL: Record<Lang, string> = {
    'zh-CN': '简体中文',
    en: 'EN',
}

export function isLang(value: unknown): value is Lang {
    return value === 'zh-CN' || value === 'en'
}

export function getInitialLang(): Lang {
    const stored = localStorage.getItem(I18N_STORAGE_KEY)
    if (isLang(stored)) return stored

    const nav = navigator.language
    if (nav && nav.toLowerCase().startsWith('zh')) return 'zh-CN'
    return 'en'
}

export const resources = {
    'zh-CN': {
        translation: {
            meta: {
                title: 'masteryyh\'s home',
            },
            roles: {
                backend: '后端开发',
                fullstack: '全栈开发',
                devOps: 'DevOps',
            },
            header: {
                tagline: '后端 / 全栈 / DevOps 工程师',
            },
            actions: {
                open: '打开',
            },
            contact: {
                title: '联系方式',
                email: '邮箱',
                phone: '手机号',
                wechat: '微信',
                github: 'GitHub',
                linkedin: 'LinkedIn',
                credly: 'Credly',
            },
            about: {
                title: '关于我',
                items: [
                    '后端 / 全栈工程师：Go、Java、Node.js、React...',
                    'DevOps 工程师：CI/CD、Kubernetes、IaC、自动化和可观测性',
                    'Homelab 爱好者，正在家自建数据中心',
                    '一只孟加拉豹猫🐱的朋友和家人'
                ],
            },
            cert: {
                title: '证书',
                valid: '有效',
                linuxFoundation: 'Linux 基金会',
                viewOnCredly: '在 Credly 查看',
            },
            stack: {
                title: '技术栈',
                labels: {
                    languagesFrameworks: '语言 / 框架',
                    dbMiddlewares: '数据库 / 中间件',
                    cloud: '云原生 / 运维',
                    frontendFullstack: '前端 / 全栈',
                },
            },
            footer: {
                builtWith: '使用 Vite + React 构建 ❤️',
            },
            terminal: {
                line2: '后端 / 全栈 / DevOps',
            },
            colorMode: {
                ariaLabel: '主题：{{mode}}。点击切换。',
                system: '系统',
                light: '浅色',
                dark: '深色',
            }
        },
    },
    en: {
        translation: {
            meta: {
                title: 'masteryyh\'s home',
            },
            roles: {
                backend: 'Backend',
                fullstack: 'Fullstack',
                devOps: 'DevOps',
            },
            header: {
                tagline: 'Backend / Fullstack / DevOps engineer',
            },
            actions: {
                open: 'Open',
            },
            contact: {
                title: 'Contact',
                email: 'Email',
                phone: 'Phone',
                wechat: 'WeChat',
                github: 'GitHub',
                linkedin: 'LinkedIn',
                credly: 'Credly',
            },
            about: {
                title: 'About',
                items: [
                    'Backend / Fullstack engineer: Go, Java, Node.js, React...',
                    'DevOps engineer: CI/CD, Kubernetes, IaC, automation, and observability.',
                    'Homelab enthusiast who is building a home datacenter.',
                    'A friend and family member of a Bengal cat 🐱',
                ],
            },
            cert: {
                title: 'Certifications',
                valid: 'Valid',
                linuxFoundation: 'The Linux Foundation',
                viewOnCredly: 'View on Credly',
            },
            stack: {
                title: 'Tech stack',
                labels: {
                    languagesFrameworks: 'Languages / Frameworks',
                    dbMiddlewares: 'Databases / Middlewares',
                    cloud: 'Cloud / Ops',
                    frontendFullstack: 'Frontend / Fullstack',
                },
            },
            footer: {
                builtWith: 'Built using Vite + React with ❤️',
            },
            terminal: {
                line2: 'Backend / Fullstack / DevOps',
            },
            colorMode: {
                ariaLabel: 'Theme: {{mode}}. Click to switch.',
                system: 'System',
                light: 'Light',
                dark: 'Dark',
            }
        },
    },
} as const
