/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#baddff',
          300: '#8ac7ff',
          400: '#53a8ff',
          500: '#2c88ff',
          600: '#1569f5',
          700: '#1255e1',
          800: '#1546b6',
          900: '#173e8f'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
