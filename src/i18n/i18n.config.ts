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
                    '后端 / 全栈工程师',
                    'DevOps 工程师：CI/CD、容器与基础设施自动化',
                    'Homelab 爱好者，喜欢折腾自托管服务与家庭网络',
                    '曾就职于 SUSE',
                ],
            },
            cert: {
                title: '证书',
                valid: '有效',
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
            footer: {
                builtWith: '使用 React 构建',
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
                fullstack: 'Full-stack',
                devOps: 'DevOps',
            },
            header: {
                tagline: 'Backend / Full-stack / DevOps engineer',
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
                    'Backend / full-stack engineer',
                    'DevOps engineer: CI/CD, containers, and infrastructure automation.',
                    'Homelab enthusiast who enjoys self-hosting and home networking.',
                    'Former employee of SUSE',
                ],
            },
            cert: {
                title: 'Certifications',
                valid: 'Valid',
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
            footer: {
                builtWith: 'Built with React',
            },
            terminal: {
                line2: 'Backend / Full-stack / DevOps',
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
