/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
        mono: ['monospace'], // Default mono
      },
      colors: {
        abyss: {
          950: '#020617', // Deepest black
          900: '#0f172a',
          800: '#1e293b',
        },
        relic: {
          gold: '#fbbf24',
          amber: '#d97706',
        }
      },
      animation: {
        'shake': 'shake 0.5s ease-in-out',
        'flash-red': 'flashRed 0.3s ease-in-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'float-up': 'floatUp 1s forwards',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px) rotate(-1deg)' },
          '75%': { transform: 'translateX(2px) rotate(1deg)' },
        },
        flashRed: {
          '0%': { backgroundColor: 'rgba(220, 38, 38, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
        pulseGold: {
          '0%, 100%': { color: '#fbbf24', transform: 'scale(1)' },
          '50%': { color: '#ffffff', transform: 'scale(1.1)' },
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
