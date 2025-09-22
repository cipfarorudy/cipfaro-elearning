export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "ui-sans-serif",
          "Segoe UI",
          "Roboto",
          "Arial",
          "Noto Sans",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: { "2xl": "1280px" },
      },
      boxShadow: {
        card: "0 10px 15px -3px rgba(2, 6, 23, 0.05), 0 4px 6px -2px rgba(2, 6, 23, 0.03)",
      },
    },
  },
  plugins: [],
} as import("tailwindcss").Config;
