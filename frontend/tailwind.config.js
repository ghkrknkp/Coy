/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coy: {
          primary: '#EC4899',
          deep: '#DB2777',
          soft: '#FCE7F3',
          light: '#FFF1F7',
          bg: '#FFF9FC',
          card: '#FFFFFF',
          text: '#18111B',
          muted: '#786B78',
          border: '#F3DCE8',
          like: '#16A36A',
          pass: '#F04465',
          // Tailwind compatibility aliases
          50: '#FFF1F7',
          100: '#FCE7F3',
          200: '#F3DCE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card-soft': '0 12px 36px -8px rgba(236, 72, 153, 0.08), 0 4px 16px -4px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 45px -10px rgba(236, 72, 153, 0.16), 0 8px 24px -6px rgba(0, 0, 0, 0.05)',
        'btn-like': '0 8px 24px -4px rgba(236, 72, 153, 0.45)',
        'btn-pass': '0 8px 24px -4px rgba(240, 68, 101, 0.25)',
        'pill': '0 2px 8px -2px rgba(236, 72, 153, 0.12)',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
