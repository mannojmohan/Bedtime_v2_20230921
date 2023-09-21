module.exports = {
    content: [
        './apps/**/*.html',
        './assets/**/*.js',
        './assets/**/*.tsx',
        './assets/**/*.ts',
        './templates/**/*.html',
    ],
    safelist: [
        'alert-success',
        'alert-info',
        'alert-error',
        'alert-warning',
    ],
    daisyui: {
        themes: [
            {
                'light': {
                    "primary": "hsla(184, 82%, 20%, 1)",
                    "primary-focus": "hsla(184, 82%, 30%, 1)",
                    "primary-content": "#fff",
                    "secondary": "#c44507",
                    "secondary-focus": "hsla(37, 98%, 62%, 1)",
                    "secondary-content": "hsla(193, 74%, 12%, 1)",
                    "accent": "#37cdbe",
                    "accent-focus": "#2aa79b",
                    "accent-content": "#fff",
                    "neutral": "#2a2e37",
                    "neutral-focus": "#16181d",
                    "neutral-content": "#fff",
                    "base-100": "#FFFFFF",
                    "base-200": "#FFFFFF",
                    "base-300": "#FFFFFF",
                    "base-content": "hsla(193, 74%, 12%, 1)",
                    "info": "#66c6ff",
                    "success": "#87d039",
                    "warning": "#e2d562",
                    "error": "#ff6f6f",
                }
            },
        ]
    },
    // https://coolors.co/09575d-0c2527-2d3839-5e6d6e-f1f3f3
    theme: {
        extend: {
            aspectRatio: {
                '3/2': '3 / 2',
            },
            colors: {
                'primary': 'hsla(184, 82%, 20%, 1)',
                "secondary": "#c44507",
                'darkest': 'hsla(184, 52%, 10%, 1)',
                'dark': 'hsla(184, 12%, 33%, 1)',
                'medium': 'hsla(184, 8%, 80%, 1)',
                'light': 'hsla(184, 8%, 95%, 1)',
                'lightest': 'hsla(184, 2%, 98%, 1)',
            },
            screens: {
                'tall': { 'raw': '(min-height: 800px)' },
                // => @media (min-height: 800px) { ... }
            }
        },
        container: {
            center: true,
            // padding: '2rem',
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require("daisyui"),
    ],
}