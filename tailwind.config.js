/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: '#FDF6E3',
                accent: '#F09A59',
                borderDark: '#332A24',
                surface: '#FCF6D7',
                surfaceLight: '#FFFFFF',
                textPrimary: '#332A24',
                textSecondary: '#66615b',
                success: '#9bb988',
                danger: '#d97f7f',
            }
        },
    },
    plugins: [],
}
