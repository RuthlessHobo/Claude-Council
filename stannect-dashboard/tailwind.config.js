/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        brand: "var(--brand)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        accent: {
          1: "var(--accent-1)",
          2: "var(--accent-2)",
          3: "var(--accent-3)",
        },
        // Raw light-mode brand values for fixed (non-themed) refs.
        stannect: {
          bg: "#edeee7",
          bronze: "#a2825d",
          sage: "#bdbca8",
          beige: "#b4a98f",
          "bronze-mid": "#ab9576",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Poppins", "Montserrat", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 50px -20px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px var(--brand-10), 0 18px 60px -24px var(--brand-30)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "dash-flow": {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft": "pulse-soft 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
