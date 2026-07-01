import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        charcoal: "var(--charcoal)",
        paper: "var(--paper)",
        mist: "var(--mist)",
        cloud: "var(--cloud)",
        line: "var(--line)",
        gold: "var(--gold)",
        "gold-light": "var(--gold-light)",
        muted: "var(--muted)",
        "card-inner": "var(--card-inner)",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
