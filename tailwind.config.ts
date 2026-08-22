import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-soft": "var(--color-bg-soft)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        // Accents
        orange: "var(--color-orange)",
        "orange-light": "var(--color-orange-light)",
        "orange-mid": "var(--color-orange-mid)",
        purple: "var(--color-purple)",
        "purple-light": "var(--color-purple-light)",
        "purple-mid": "var(--color-purple-mid)",
        blue: "var(--color-blue)",
        "blue-light": "var(--color-blue-light)",
        "blue-mid": "var(--color-blue-mid)",
        green: "var(--color-green)",
        "green-light": "var(--color-green-light)",
        red: "var(--color-red)",
        "red-light": "var(--color-red-light)",
        // Code
        "code-bg": "var(--color-code-bg)",
        "code-border": "var(--color-code-border)",
        "code-text": "var(--color-code-text)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Menlo", "monospace"],
      },
      maxWidth: {
        lesson: "72ch",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--color-text-secondary)",
            "--tw-prose-headings": "var(--color-text-primary)",
            "code::before": { content: '""' },
            "code::after": { content: '""' },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
