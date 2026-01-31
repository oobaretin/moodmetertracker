/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quadrant: {
          yellow: '#FCD34D',
          red: '#F87171',
          blue: '#60A5FA',
          green: '#34D399',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shift-card-in': 'shiftCardFadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shiftCardFadeIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, -45%)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%)' },
        },
      },
    },
  },
  plugins: [],
}




