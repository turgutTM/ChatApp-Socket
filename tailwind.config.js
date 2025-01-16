/** @type {import('tailwindcss').Config} */
const { withUt } = require("uploadthing/tw");

module.exports = withUt({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-blue-black":
          "linear-gradient(to right, #0000FF, #000000, #0000FF)",
        "gradient-green-black":
          "linear-gradient(to right, #008000, #000000, #008000)",
      },
      backgroundSize: {
        400: "400% 400%",
      },
      animation: {
        "gradient-blue-black": "gradientBlueBlack 4s linear infinite",
        "gradient-green-black": "gradientGreenBlack 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        gradientBlueBlack: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 0%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        gradientGreenBlack: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 0%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
});
