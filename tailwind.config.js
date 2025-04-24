/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./assets/js/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ana tema rengi
        'theme-primary': '#2563eb', // Mavi tonu
        'theme-secondary': '#1d4ed8', // Daha koyu mavi
        'theme-accent': '#3b82f6', // Açık mavi 
        'theme-light': '#f3f4f6', // Açık gri
        'theme-dark': '#111827', // Koyu lacivert/siyah
        
        // Dark mode renkleri
        'dark-primary': '#0f0f0f',
        'dark-secondary': '#141414',
        'dark-accent': '#f5f5f5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [],
} 