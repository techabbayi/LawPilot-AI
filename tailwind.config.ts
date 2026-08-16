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
        legalPrimary: "#1E3A8A",
        legalSecondary: "#0F172A",
        legalAccent: "#D4AF37",
        legalBg: "#F8FAFC",
        legalBorder: "#E2E8F0",
      },
    },
  },
  plugins: [],
};
export default config;
