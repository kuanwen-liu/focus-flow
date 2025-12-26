import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Using CSS variables for runtime theme switching
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      backdropBlur: {
        md: '12px',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(19, 182, 236, 0.3)',
        'glow-primary-lg': '0 0 40px rgba(19, 182, 236, 0.5)',
      },
    },
  },
  plugins: [],
}

export default config
