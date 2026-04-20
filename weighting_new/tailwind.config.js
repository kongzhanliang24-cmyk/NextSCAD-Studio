/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx,json}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          light: '#2d5a8e',
          dark: '#0f1f33',
          50: '#eef4fa',
          100: '#d5e3f0',
          200: '#adc7e1',
          300: '#7ea5cc',
          400: '#4e7fb3',
          500: '#1e3a5f',
          600: '#1a3354',
          700: '#152a45',
          800: '#0f1f33',
          900: '#0a1522'
        },
        accent: {
          DEFAULT: '#e8a838',
          light: '#f0c060',
          dark: '#c08820'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Microsoft JhengHei"',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
}
