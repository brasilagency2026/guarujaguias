/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        ocean: {
          DEFAULT: "#0a4f6e",
          mid: "#1a7fa0",
          light: "#b8e0ef",
          50: "#e8f4fb",
        },
        sand: {
          DEFAULT: "#f5e6c8",
          dark: "#d4a853",
        },
        coral: {
          DEFAULT: "#e05a3a",
          light: "#fae8e2",
        },
      },
    },
  },
  plugins: [],
};
