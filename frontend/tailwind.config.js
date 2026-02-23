/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                threat: {
                    low: '#10b981',
                    medium: '#f59e0b',
                    high: '#ef4444',
                    critical: '#dc2626'
                },
                cyber: {
                    dark: '#0a0e27',
                    darker: '#050814',
                    blue: '#00d4ff',
                    purple: '#a855f7',
                    pink: '#ec4899'
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-in': 'slideIn 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-in',
                'glow': 'glow 2s ease-in-out infinite alternate'
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' }
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'cyber-grid': 'linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)'
            }
        },
    },
    plugins: [],
}
