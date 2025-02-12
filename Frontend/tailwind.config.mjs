/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontWeight: {
        normal: 400,
        bold: 700,
        black: 900,
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        roca2: ["var(--font-roca2)"],
        sans: ["var(--font-roca2)"],
      },
    },
  },
  plugins: [],
};
