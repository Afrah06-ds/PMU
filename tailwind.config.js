/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#bae0ff',
          300: '#7cc2ff',
          400: '#369eff',
          500: '#097eff',
          600: '#005fe6',
          700: '#0048b8',
          800: '#003b94',
          900: '#003078',
          950: '#001a47',
        },
        academic: {
          navy: '#0F172A',
          gold: '#D97706',
          emerald: '#059669',
          rose: '#E11D48',
          purple: '#7C3AED',
          slate: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        serif: ['Times New Roman', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
