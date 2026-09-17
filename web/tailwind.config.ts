import type { Config } from "tailwindcss";

// Ranglar Samarqand koshinlaridan: tun (lojuvard osmon), zar (oltin), qor (tog' cho'qqilari)
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        tun: {
          950: "#0b1022",
          900: "#121937",
          800: "#1b2448",
          700: "#27325e",
          600: "#384578",
        },
        zar: {
          200: "#f8e6b6",
          300: "#f3d38a",
          400: "#eebf55",
          500: "#d9a333",
          600: "#b0801c",
        },
        lojuvard: {
          300: "#a9c2f5",
          400: "#7399e6",
          500: "#4b72cf",
        },
        qor: {
          50: "#f4f5f9",
          100: "#e6e9f2",
          300: "#b9bfd3",
          500: "#8c93ab",
        },
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "sans-serif"],
        body: ["var(--font-onest)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
