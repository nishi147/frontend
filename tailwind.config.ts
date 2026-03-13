import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#fdf4f2',
          100: '#fbe9e4',
          200: '#f8d2c9',
          300: '#f4b8a8',
          400: '#f09a80',
          500: '#f4693a', // Ruzann Coral
          600: '#dc5f34',
        },
        secondary: {
          500: '#6b4fbb', // Ruzann Purple
          600: '#5a42a0',
        },
        accent: {
          500: '#0d9488', // Ruzann Teal
        },
        navy: {
          900: '#0f172a', // Hero Navy
          800: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'sans-serif'],
        baloo: ['var(--font-baloo)', 'cursive'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
