export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        glideUp: {
          "0%": { transform: "translateY(-150px)", opacity: "1" },
          "100%": { transform: "translateY(0p)", opacity: "1" },
        },
      },
      animation: {
        glideUp: "glideUp 1s ease forwards",
      },
      colors: {
        lemon: "#a4c639",
        forest: "#228B22",
        water: "#1ca9c9",
        sunshine: "#FFD700",
      },
      fontFamily: {
        logo: ["Dancing Script", "cursive"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
