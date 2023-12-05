/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'mono': ['ui-monospace', 'SFMono-Regular'],
    },
    extend: {
      height: {
        '4.5': '1.125rem'
      },
      spacing: {
        '30': '7.5rem',
        '50': '12.5rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
      },
      maxWidth: {
        '10': '10rem',
        '11': '11rem',
        '12': '12rem',
        '13': '13rem',
        '14': '14rem',
      },
      minHeight: {
        '24': '6rem',
        '20': '5rem',
        '18': '4.5rem',
      },
      fontSize: {
        smd: '0.938rem',
      },
      colors: {
        'neutral-150': '#e9e9e9',
        'zinc-350': 'rgb(195 195 193)',
        'zinc-450': 'rgb(130 130 140)',
      },
      brightness: {
        85: '.85',
        80: '.80',
      },
      animation: {
        'spin-slow': 'spin 1.25s linear infinite',
      }
    },
  },
}

