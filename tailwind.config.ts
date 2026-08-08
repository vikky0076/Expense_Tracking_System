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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          green: {
            50: "#ECFDF5",
            100: "#D1FAE5",
            200: "#A7F3D0",
            500: "#10B981",
            600: "#059669",
            700: "#047857",
          },
          orange: {
            50: "#FFF7ED",
            100: "#FFEDD5",
            200: "#FED7AA",
            500: "#F97316",
            600: "#EA580C",
            700: "#C2410C",
          },
          slate: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            700: "#334155",
            900: "#0F172A",
          }
        }
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(16, 185, 129, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
};
export default config;
