/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Varela Round', 'system-ui', 'sans-serif'],
      },
      colors: {
        light: {
          bg: '#1a2b2b',
        },
        dark: {
          bg: 'rgb(3, 7, 18)', // gray-950
        },
        teal: {
          DEFAULT: '#20B2AA',
          dark: '#008B8B',
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(32, 178, 170, 0.3)',
        'glow-hover': '0 0 20px rgba(32, 178, 170, 0.5)',
      },
      textShadow: {
        'glow': '0 0 10px rgba(32, 178, 170, 0.5)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-glow': {
          'text-shadow': '0 0 10px rgba(32, 178, 170, 0.5)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
}