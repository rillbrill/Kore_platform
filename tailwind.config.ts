import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        kore: {
          bg: "#F1F3F0",
          dark: "#14151A",
          lime: "#C4F542",
          green: "#128A54",
          red: "#E0402C",
          muted: "#9EA09B",
          subtle: "#5B5D5A",
          eyebrow: "#8A8C88",
          border: "rgba(0, 0, 0, 0.08)",
        },
      },
      fontFamily: {
        sans: ["Hanken Grotesk", "Pretendard Variable", "system-ui", "sans-serif"],
        disp: ["Space Grotesk", "Pretendard Variable", "sans-serif"],
        serif: ["Instrument Serif", "Pretendard Variable", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
