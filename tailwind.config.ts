import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15171C",
        charcoal: "#2A2C32",
        paper: "#FFFFFF",
        mist: "#F4F4F5",
        cloud: "#EAEAEC",
        line: "#E2E2E5",
        gold: "#C8962A",
        "gold-light": "#E8B84B",
        muted: "#6B6E76",
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
