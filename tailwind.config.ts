import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        strava: {
          orange: '#fc5200',
          'orange-dark': '#e34800',
          gray: {
            100: '#f7f7fa',
            200: '#dfdfe8',
            300: '#c7c7d1',
            400: '#9595a5',
            500: '#6d6d78',
            600: '#42424a',
            700: '#242428',
          }
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'strava': '0 2px 4px rgba(0,0,0,0.08)',
        'strava-hover': '0 4px 8px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
