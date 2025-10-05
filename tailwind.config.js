/** @type {import('tailwindcss').Config} */
export default {
  content: ["dist/**/*.html", "site/**/*.json"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        brand: "var(--brand)"
      },
      borderRadius: {
        DEFAULT: "var(--radius-2)"
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        6: "var(--space-6)",
        8: "var(--space-8)"
      },
      fontFamily: {
        sans: "var(--font)"
      }
    }
  },
  corePlugins: { preflight: false }
};
