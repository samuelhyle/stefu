/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.jsx",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFEDB3',
          200: '#FFE180',
          300: '#FFD54D',
          400: '#FFC91A',
          500: '#C9A85D',
          600: '#B8944D',
          700: '#9A7A3D',
          800: '#7C612E',
          900: '#5E481F',
        },
        obsidian: {
          50: '#2A2A2A',
          100: '#1F1F1F',
          200: '#141414',
          300: '#0D0D0D',
          400: '#0A0A0A',
          500: '#050505',
        }
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(201, 168, 93, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(201, 168, 93, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}