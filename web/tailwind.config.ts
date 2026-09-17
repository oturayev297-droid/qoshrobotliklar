import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#FBF7F0",
          100: "#F5EDE0",
          200: "#EBDFC7",
          300: "#DCC9A3",
        },
        clay: {
          400: "#D48A54",
          500: "#C1652F",
          600: "#A6501F",
          700: "#833E17",
        },
        deep: {
          500: "#2C7A8C",
          600: "#1F5C73",
          700: "#164A5E",
          800: "#0E3542",
          900: "#0A222B",
        },
        ink: {
          800: "#2B241C",
          900: "#1B160F",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "grain-pattern":
          "radial-gradient(circle at 1px 1px, rgba(27,22,15,0.06) 1px, transparent 0)",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(27,22,15,0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
