/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#060d1d',
          800: '#0b162c',
          700: '#112244',
        },
        cyan: {
          450: '#00f2fe',
        },
        ocean: {
          deep: '#031926',
          mid: '#0f4c81',
          accent: '#00d2ff'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 60s linear infinite',
      }
    },
  },
  plugins: [],
}
