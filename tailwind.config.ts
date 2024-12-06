import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./my-next-app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./my-next-app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./my-next-app/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
