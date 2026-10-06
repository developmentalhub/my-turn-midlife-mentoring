import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mist: "#EAF4F8",
        skywash: "#DCEEF4",
        ink: "#24343A",
        ocean: "#355F6B",
        leaf: "#526E61",
        cream: "#FFF9F0",
        blush: "#F1DDD5",
        lilac: "#DDD8EA",
      },
      boxShadow: {
        soft: "0 20px 55px rgba(45, 78, 88, 0.12)",
        card: "0 12px 35px rgba(45, 78, 88, 0.10)",
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
