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
        main: "#0a1a2f",
        secondary: "#1f3b58",
        accent1: "#d6a84e",
        accent2: "#f4ede2",
        base: "#ffffff",
      },
    },
  },
  plugins: [],
};

export default config;
