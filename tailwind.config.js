/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/@frostui/tailwindcss/dist/*.js"
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
    },
    fontFamily: {
      'base': ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        'primary': '#FCD34D',
        'secondary': '#1F2937',
        'success': '#1CB454',
        'warning': '#E2A907',
        'info': '#0895D8',
        'danger': '#E63535',
        'light': '#eef2f7',
        'dark': '#313a46',
      },
      keyframes: {
        load: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      },
    },
  },
  plugins: [
    require('@frostui/tailwindcss/plugin'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
