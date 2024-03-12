/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'primary-color': '#1C274C',
            },
            fontFamily: {
                bebas: ['Bebas Neue', 'serif'],
            },
            fontSize: {
                '2xl': '1.8rem',
                '3xl': '2.4rem',
                '4xl': '3.2rem',
              }
        },
    },

    plugins: [require('@tailwindcss/forms')],
};
