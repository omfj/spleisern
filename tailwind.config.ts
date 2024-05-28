import forms from "@tailwindcss/forms";

import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "640px",
      },
    },
    extend: {
      colors: {
        primary: "var(--primary)",
        foreground: "var(--foreground)",
        background: "var(--background)",
      },
    },
  },
  plugins: [forms],
} satisfies Config;
