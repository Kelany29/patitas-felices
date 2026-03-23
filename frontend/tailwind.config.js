/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'celeste-pastel': '#B2E2F2',
        'celeste-fuerte': '#81D4FA',
        'fondo-crema': '#F8FAFC',
        'texto-pet': '#334155',
      },
      borderRadius: {
        'pet': '24px',
      }
    },
  },
  plugins: [],
}