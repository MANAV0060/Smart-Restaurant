/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          cream: '#FFF6DE',   // Main Warm Background
          teal: '#8BDFDD',    // Soft Pastel Cyan / Mint
          coral: '#F48F68',   // Warm Coral Terracotta
          yellow: '#FFE394',  // Butter Mellow Gold
        },
        bistro: {
          bg: '#FFF6DE',
          surface: '#FFFFFF',
          panel: '#FFFBF2',
          border: '#EADBBA',
          text: '#1C1917',
          muted: '#78716C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}
