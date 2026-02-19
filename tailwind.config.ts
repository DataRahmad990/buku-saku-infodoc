import type { Config } from "tailwindcss";

const config: Config = {
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
          "red-light": "#FF3347",
          "red-pale": "#FFF0F2",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 20px rgba(192,0,26,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
