/** @type {import("tailwindcss").Config} */
export default {
    // Use a custom selector so `dark:` variants follow our generic `data-theme` mechanism.
    // (Tailwind docs: darkMode: ['selector', '[data-mode="dark"]'])
    darkMode: ["selector", "[data-theme=\"dark\"]"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/typography")],
};

