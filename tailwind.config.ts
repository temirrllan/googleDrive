import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: "#f8fafd",
        surface: "#ffffff",
        hover: "#e8eaed",
        rowHover: "#f1f3f4",
        selected: "#c2e7ff",
        outline: "#e0e3e7",
        brand: "#1a73e8",
        ink: "#1f1f1f",
        secondary: "#444746",
        muted: "#5f6368",
        newBtnBg: "#c2e7ff",
        newBtnHover: "#a8c7fa",
        newBtnText: "#001d35",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(60,64,67,.1), 0 1px 3px 1px rgba(60,64,67,.05)",
        menu: "0 2px 6px 2px rgba(0,0,0,.08), 0 1px 2px 0 rgba(60,64,67,.16)",
        newBtn: "0 1px 3px 0 rgba(60,64,67,.15), 0 4px 8px 3px rgba(60,64,67,.05)",
      },
    },
  },
  plugins: [],
} satisfies Config;
