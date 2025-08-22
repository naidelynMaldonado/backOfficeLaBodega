/** @type {import('tailwindcss').Config} */
const { join } = require('path');
const { plugin } = require('postcss');
module.exports = {
  content: [join(__dirname, './src/**/!(*.stories|*.spec).{ts,html,scss}')],
  // Scope Tailwind's important rules to the <main> element so utilities take priority
  // only inside <main> instead of globally (was: true)
  important: 'main',
  theme: {
    extend: {
      fontFamily: {
        sans :'Poppins'
      },
      fontSize: {
        //Titles
        'tittle-1-bold': ["2.625rem", { lineHeight: "3.625rem", fontWeight: '700' }],
        'tittle-1-medium': ["2.625rem", { lineHeight: "3.625rem", fontWeight: '500' }],
        'tittle-1-regular': ["2.625rem", { lineHeight: "3.625rem", fontWeight: '400' }],

        'tittle-2-bold': ["2rem", { lineHeight: "2.5rem", fontWeight: '700' }],
        'tittle-2-medium': ["2rem", { lineHeight: "2.5rem", fontWeight: '500' }],
        'tittle-2-regular': ["2rem", { lineHeight: "2.5rem", fontWeight: '400' }],

        'tittle-3-bold': ["1.5rem", { lineHeight: "2.25rem", fontWeight: '700' }],
        'tittle-3-medium': ["1.5rem", { lineHeight: "2.25rem", fontWeight: '500' }],
        'tittle-3-regular': ["1.5rem", { lineHeight: "2.25rem", fontWeight: '400' }],

        'tittle-4-bold':["1.1rem", { lineHeight:"1.688rem", fontWeight:'700' }],
        'tittle-4-medium':["1.1rem", { lineHeight:"1.688rem", fontWeight:'500' }],
        'tittle-4-regular':["1.1rem", { lineHeight:"1.688rem", fontWeight:'400' }],

        //Subtitles
        'subtitle-1-bold': ["1.25rem", { lineHeight: "1.875rem", fontWeight: '700' }],
        'subtitle-1-medium': ["1.25rem", { lineHeight: "1.875rem", fontWeight: '500' }],
        'subtitle-1-regular': ["1.25rem", { lineHeight: "1.875rem", fontWeight: '400' }],

        'subtitle-2-bold': ["1.125rem", { lineHeight: "1.75rem", fontWeight: '700' }],
        'subtitle-2-medium': ["1.125rem", { lineHeight: "1.75rem", fontWeight: '500' }],
        'subtitle-2-regular': ["1.125rem", { lineHeight: "1.75rem", fontWeight: '400' }],

        //Body
        'body-1-bold': ["1rem", { lineHeight: "1.5rem", fontWeight: '700' }],
        'body-1-medium': ["1rem", { lineHeight: "1.5rem", fontWeight: '500' }],
        'body-1-regular': ["1rem", { lineHeight: "1.5rem", fontWeight: '400' }],

        'body-2-bold': ["0.875rem", { lineHeight: "1.375rem", fontWeight: '700' }],
        'body-2-medium': ["0.875rem", { lineHeight: "1.375rem", fontWeight: '500' }],
        'body-2-regular': ["0.875rem", { lineHeight: "1.375rem", fontWeight: '400' }],

        //Captions
        'caption-1-bold': ["0.75rem", { lineHeight: "1.125rem", fontWeight: '700' }],
        'caption-1-medium': ["0.75rem", { lineHeight: "1.125rem", fontWeight: '500' }],
        'caption-1-regular': ["0.75rem", { lineHeight: "1.125rem", fontWeight: '400' }],

        'caption-2-bold': ["0.625rem", { lineHeight: "1.125rem", fontWeight: '700' }],
        'caption-2-medium': ["0.625rem", { lineHeight: "1.125rem", fontWeight: '500' }],
        'caption-2-regular': ["0.625rem", { lineHeight: "1.125rem", fontWeight: '400' }],


      },
      colors: {
        'neutral' :{
          'white': 'var(--color-neutral-white)',
          'main-border': 'var(--color-neutral-main-border)',
          'secondary-border': 'var(--color-neutral-secondary-border)',
          'gray': 'var(--color-neutral-gray)',
          'gray-two': 'var(--color-neutral-gray-two)',
        },
        'brand':{
          'red-default': 'var(--color-brand-red-default)',
          'red-default-40': 'var(--color-brand-red-default-40)',
          'red-light': 'var(--color-brand-red-light)',
          'red-dark' : 'var(--color-brand-red-dark)',
          'blue-default': 'var(--color-brand-blue-default)',
          'blue-default-40': 'var(--color-brand-blue-default-40)',
          'blue-light': 'var(--color-brand-blue-light)',
          'blue-superlight': 'var(--color-brand-blue-superlight)',
          'blue-dark': 'var(--color-brand-blue-dark)',
          'black': 'var(--color-brand-black)',
          'black-light': 'var(--color-brand-light)',
        },
        'semantic': {
          'success': 'var(--color-semantic-success)',
          'success-variant': 'var(--color-semantic-success-variant)',
          'warning': 'var(--color-semantic-warning)',
          'error': 'var(--color-semantic-error)'
        }
      },
      boxShadow: {
        'SMALL': 'var(--shadow-small)',
        'brand': 'var(--shadow-brand)',
        'MEDIUM': 'var(--shadow-medium)',
        'MEDIUM-TWO': 'var(--shadow-medium-two)',
        'EXTRA-LARGE': 'var(--shadow-extra-large)'
      },
      borderColor:{
        DEFAULT: 'var(--color-neutral-main-border)'
      }
    },
  },
  plugins: [
    require('./src/styles/tailwind/utilities'),
    require('@tailwindcss/forms'),
  ]
}

