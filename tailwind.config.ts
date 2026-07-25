import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#F7E9E6',
                    100: '#F0D9D4',
                    200: '#E6C8C0',
                    300: '#D8A7B9',
                    400: '#C68A9F',
                    500: '#B06D85',
                    600: '#9A546C',
                    700: '#834054',
                    800: '#6D3040',
                    900: '#57202E',
                },
                accent: {
                    50: '#FFF9F5',
                    100: '#FEF3EC',
                    200: '#FDE8D9',
                    300: '#E6C8A0',
                    400: '#D4B084',
                    500: '#C29868',
                    600: '#B0804C',
                    700: '#9E6830',
                },
                sage: {
                    50: '#F2F6F3',
                    100: '#E5EDE7',
                    200: '#C8DBD0',
                    300: '#A3C4B5',
                    400: '#7EAD9A',
                    500: '#59967F',
                },
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;