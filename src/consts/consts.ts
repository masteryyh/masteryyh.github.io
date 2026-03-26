export type Contact = {
    email: string;
    wechat: string;
    phone: string;
    github: string;
    linkedin: string;
};

export type Profile = {
    name: string;
    contact: Contact;
};

export type Cert = {
    name: string;
    issuer: string;
    year: string;
    href: string;
};

export type TechStack = Record<string, string[]>;

export const PROFILE: Profile = {
    name: "Yanhong Yang (杨雁鸿)",
    contact: {
        email: "yyh991013@163.com",
        wechat: "masteryyh",
        phone: "+86 15616700368",
        github: "https://github.com/masteryyh",
        linkedin: "https://www.linkedin.com/in/masteryyh",
    },
};

export const CERTS: Cert[] = [
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

export const TECH_STACKS: TechStack = {
    "stack.labels.languagesFrameworks": ["Go", "Gin", "GORM", "Java", "Spring Boot", "JavaScript / TypeScript", "SQL"],
    "stack.labels.dbMiddlewares": ["Redis", "PostgreSQL", "MySQL", "RabbitMQ", "MongoDB", "Elasticsearch"],
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

export const PROJECT_URL = "https://github.com/masteryyh/masteryyh.github.io";

export const RESUME_FILES: Record<string, string> = {
    "en": "yanhongyang_backend_agent.pdf",
    "zh-CN": "杨雁鸿_后端_agent.pdf",
};
