import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        theme: {
          blue: "#4F46E5",
          purple: "#8B5CF6",
          pink: "#EC4899",
          orange: "#F97316",
          green: "#10B981",
          yellow: "#FBBF24",
          red: "#EF4444",
        },
        surface: {
          light: "#FFFFFF",
          DEFAULT: "#F9FAFB",
          hover: "#F3F4F6",
          dark: "#E5E7EB",
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'glow': {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
            opacity: 0.8
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)', 
            opacity: 1 
          }
        },
        'text-gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-x': 'gradient-x 15s ease infinite',
        'pulse-slow': 'pulse-slow 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 10s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'text-gradient': 'text-gradient 3s ease infinite'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 15px rgba(139, 92, 246, 0.5)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'button': '0 2px 5px rgba(0, 0, 0, 0.1)',
        'hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'feature': '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-noise': 'url("/assets/noise-pattern.png"), linear-gradient(var(--tw-gradient-stops))',
        'dotted-pattern': 'radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
