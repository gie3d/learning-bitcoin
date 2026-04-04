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
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "accent-amber": "var(--color-accent-amber)",
        "accent-teal": "var(--color-accent-teal)",
        "code-bg": "var(--color-code-bg)",
        "code-border": "var(--color-code-border)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Menlo", "monospace"],
      },
      maxWidth: {
        lesson: "72ch",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--color-text-primary)",
            "--tw-prose-headings": "var(--color-text-primary)",
            "--tw-prose-lead": "var(--color-text-secondary)",
            "--tw-prose-links": "var(--color-accent-teal)",
            "--tw-prose-bold": "var(--color-text-primary)",
            "--tw-prose-counters": "var(--color-text-secondary)",
            "--tw-prose-bullets": "var(--color-text-secondary)",
            "--tw-prose-hr": "var(--color-border)",
            "--tw-prose-quotes": "var(--color-text-primary)",
            "--tw-prose-quote-borders": "var(--color-accent-amber)",
            "--tw-prose-captions": "var(--color-text-secondary)",
            "--tw-prose-code": "var(--color-text-primary)",
            "--tw-prose-pre-code": "var(--color-text-primary)",
            "--tw-prose-pre-bg": "var(--color-code-bg)",
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
