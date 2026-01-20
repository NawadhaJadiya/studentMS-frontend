/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        creme: "#FAF7F2",
        gold: "#D4AF37",
        brown: "#5A3E2B",
      },
    },
  },
  plugins: [],
};
