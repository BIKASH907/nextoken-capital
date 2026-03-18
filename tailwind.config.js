/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#F0B90B',
        'gold-light': '#FFD700',
        'dark': '#0B0E11',
        'dark-2': '#161A1E',
        'dark-3': '#1E2329',
        'dark-4': '#252930',
        'dark-5': '#2B3139',
        'green-up': '#0ECB81',
        'red-down': '#F6465D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
