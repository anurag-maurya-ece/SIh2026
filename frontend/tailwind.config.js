/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        neo: {
          amber: '#FFB703',
          orange: '#FB8500',
          blue: '#E0F2FE',
          green: '#DCFCE7',
          black: '#000000',
          dark: '#0A0A0A',
        },
        space: {
          950: '#020612',
          900: '#050c1e',
          850: '#08132b',
          800: '#0c1a38',
          700: '#11254e',
        },
        ocean: {
          deep: '#031926',
          mid: '#0f4c81',
          accent: '#0284c7',
          surface: '#0284c7',
        }
      },
      boxShadow: {
        'neo': '3.5px 3.5px 0px 0px #000000',
        'neo-sm': '2px 2px 0px 0px #000000',
        'neo-lg': '5px 5px 0px 0px #000000',
        'neo-active': '0px 0px 0px 0px #000000',
        'hud': '3.5px 3.5px 0px 0px #000000',
        'hud-sm': '2px 2px 0px 0px #000000',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 60s linear infinite',
      }
    },
  },
  plugins: [],
}
