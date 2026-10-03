/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        themePrimary: 'var(--primary-color)',
        themeAccent: 'var(--accent-color)',
        themeBg: 'var(--bg-color)',
        themeText: 'var(--text-color)',
      },
    },
  },
  plugins: [],
}
