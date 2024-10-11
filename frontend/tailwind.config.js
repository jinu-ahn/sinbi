/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "mobile-small": "320px", // For devices with 320px width (small)
        "mobile-medium": "375px", // For devices with 375px width (medium)
        "mobile-large": "425px", // For devices with 425px width (large)
      },
    },
  },
  plugins: [],
};
