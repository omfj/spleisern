import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
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
