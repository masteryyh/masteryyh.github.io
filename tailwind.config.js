/** @type {import("tailwindcss").Config} */
export default {
    // Use a custom selector so `dark:` variants follow our generic `data-theme` mechanism.
    // (Tailwind docs: darkMode: ['selector', '[data-mode="dark"]'])
    darkMode: ["selector", '[data-theme="dark"]'],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Instrument Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
                mono: ["JetBrains Mono", "Menlo", "Monaco", "Courier New", "monospace"],
            },
            colors: {
                primary: "rgb(var(--color-primary) / <alpha-value>)",
                accent: "rgb(var(--color-accent) / <alpha-value>)",
                warn: "rgb(var(--color-warn) / <alpha-value>)",
            },
            animation: {
                shimmer: "shimmer 2s linear infinite",
                float: "float 3s ease-in-out infinite",
            },
            boxShadow: {
                soft: "0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 4px 16px -4px rgba(0, 0, 0, 0.08)",
                "soft-lg": "0 8px 24px -6px rgba(0, 0, 0, 0.12), 0 16px 48px -12px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
