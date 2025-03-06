import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1FAB89",
          50: "#96ECD7",
          100: "#84E9D0",
          200: "#62E3C3",
          300: "#3FDCB6",
          400: "#25CEA5",
          500: "#1FAB89",
          600: "#167C63",
          700: "#0E4C3D",
          800: "#051D17",
          900: "#000000",
          950: "#000000",
        },

        white: "#FFFFFF",
        red: "#d70303",
      },
    },
    fontFamily: {
      sans: ["REM", "sans-serif"],
    },
  },
  plugins: [],
} satisfies Config;
