/** @type {import("tailwindcss").Config} */
export default {
    darkMode: ["selector", '[data-theme="dark"]'],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Instrument Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
                mono: ["JetBrains Mono", "Menlo", "Monaco", "Courier New", "monospace"],
            },
            colors: {
                surface: "var(--color-surface)",
                elevated: "var(--color-elevated)",
                border: "var(--color-border)",
                "border-hover": "var(--color-border-hover)",
                "text-primary": "var(--color-text-primary)",
                "text-secondary": "var(--color-text-secondary)",
                "text-muted": "var(--color-text-muted)",
                accent: "var(--color-accent)",
                "accent-hover": "var(--color-accent-hover)",
                "accent-muted": "var(--color-accent-muted)",
                info: "var(--color-info)",
                "info-hover": "var(--color-info-hover)",
                "info-muted": "var(--color-info-muted)",
                success: "var(--color-success)",
                "success-muted": "var(--color-success-muted)",
                warn: "var(--color-warn)",
                "warn-muted": "var(--color-warn-muted)",
            },
            boxShadow: {
                card: "0 1px 3px 0 rgba(0, 0, 0, 0.06)",
                "card-hover": "0 2px 8px -2px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
