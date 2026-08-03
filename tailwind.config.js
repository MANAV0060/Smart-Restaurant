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
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        dark: {
          900: '#0b0f17',
          800: '#111827',
          700: '#1f2937',
          600: '#374151',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(249, 115, 22, 0.4), 0 0 20px rgba(249, 115, 22, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.8), 0 0 40px rgba(249, 115, 22, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
