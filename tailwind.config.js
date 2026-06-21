import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,ts,jsx,tsx}',
    ],

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
                display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                premium: {
                    DEFAULT: 'hsl(var(--premium))',
                    foreground: 'hsl(var(--premium-foreground))'
                },
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    background: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
            },
            keyframes: {
                'shimmer-slide': {
                    to: {
                        transform: 'translate(calc(100cqw - 100%), 0)'
                    }
                },
                'spin-around': {
                    '0%': {
                        transform: 'translateZ(0) rotate(0)'
                    },
                    '15%, 35%': {
                        transform: 'translateZ(0) rotate(90deg)'
                    },
                    '65%, 85%': {
                        transform: 'translateZ(0) rotate(270deg)'
                    },
                    '100%': {
                        transform: 'translateZ(0) rotate(360deg)'
                    }
                },
                fadeIn: {
                    from: {
                        opacity: '0',
                        transform: 'translateY(4px)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                slideInUp: {
                    from: {
                        opacity: '0',
                        transform: 'translateY(8px)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                shimmer: {
                    '0%': {
                        transform: 'translateX(-100%)'
                    },
                    '100%': {
                        transform: 'translateX(100%)'
                    }
                },
                'slide-down': {
                    from: { opacity: '0', transform: 'translateY(-110%)' },
                    to:   { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-in-left': {
                    from: { opacity: '0', transform: 'translateX(-110%)' },
                    to:   { opacity: '1', transform: 'translateX(0)' }
                }
            },
            animation: {
                'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
                'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
                'fadeIn': 'fadeIn 0.25s cubic-bezier(0.2, 0, 0, 1) forwards',
                'slideInUp': 'slideInUp 0.25s cubic-bezier(0.2, 0, 0, 1) forwards',
                'shimmer': 'shimmer 2s infinite',
                'slide-down': 'slide-down 0.25s cubic-bezier(0.2, 0, 0, 1) both',
                'slide-in-left': 'slide-in-left 0.25s cubic-bezier(0.2, 0, 0, 1) both'
            }
        },
    },

    plugins: [forms],
};
