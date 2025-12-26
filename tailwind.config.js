/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'electric-orange': '#FF4D00',
                'premium-beige': '#E1D9C5',
            },
            fontFamily: {
                display: ['Syne', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
            }
        },
    },
    plugins: [],
}
