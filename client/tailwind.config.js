/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E50914',
        dark: '#0A0A0F',
        card: '#12121A',
        border: '#1E1E2E',
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
