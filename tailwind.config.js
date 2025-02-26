/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scale: {
        98: ".98",
      },
      boxShadow: {
        "inset-sm": "inset -5px -5px 5px rgba(0, 0, 0, 0.4)",
        "inset-lg": "inset -5px -5px 15px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
