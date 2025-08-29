/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-black": "var(--color-brand-black)",
        "brand-white": "var(--color-brand-white)",
        "brand-green": "var(--color-brand-green)",
      },
      fontFamily: {
        roboto: ["var(--font-family-roboto)", "sans-serif"],
        poppins: ["var(--font-family-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
