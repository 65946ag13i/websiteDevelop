/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: { rb: "555px" },
      scale: {
        98: ".98",
      },
      boxShadow: {
        "inset-sm": "inset -5px -5px 5px rgba(0, 0, 0, 0.4)",
        "inset-lg": "inset -5px -5px 15px rgba(0, 0, 0, 0.3)",
      },
      colors: {
        webGreen: {
          100: "#62AA95",
          200: "#79B6A0",
          300: "#8FC1AB",
          400: "#A6CDB6",
          500: "#B1D3BC",
          600: "#BCD8C1",
        },
        webGreenToBrown: {
          100: "#B2CBD5",
          200: "#C1D6DC",
          300: "#CFE0E2",
          400: "#DDEBE8",
          500: "#EBF5EE",
          600: "#E0E2DA",
          700: "#D5CFC6",
          800: "#D0C6BC",
          900: "#CABCB2",
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true, // 确保 Preflight 是启用的
    transform: false,
    filter: false,
  },
};
