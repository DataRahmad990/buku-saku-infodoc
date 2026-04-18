import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ojk: {
          red: "#C0001A",
          "red-dark": "#8B0013",
          "red-light": "#E8384F",
          "red-pale": "#FEF2F2",
        },
        stone: {
          925: "#1A1816",
          950: "#0C0A0E",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.04)",
        soft: "0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)",
        medium: "0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)",
        heavy: "0 12px 48px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)",
        "accent-sm": "0 2px 12px rgba(192,0,26,0.08)",
        "accent-md": "0 8px 32px rgba(192,0,26,0.12)",
        dock: "0 -2px 20px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "28px",
      },
      animation: {
        "enter": "enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "enter-slow": "enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade": "fade 0.4s ease forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        enter: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(192,0,26,0.15)" },
          "100%": { boxShadow: "0 0 32px rgba(192,0,26,0.25)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
