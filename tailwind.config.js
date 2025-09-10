/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
        "*.{js,ts,jsx,tsx,mdx}"
    ],
  theme: {
    extend: {
      fontFamily: {
        groovy: ['"Luckiest Guy"', 'cursive'],
        accent: ['"Pacifico"', 'cursive'],
      },
      colors: {
        trip: {
          red: '#FF2222',
          blue: '#1A1AFF',
          white: '#FFFFFF',
          silver: '#C0C0C0',
          black: '#111111',
        },
      },
    },
  },
  plugins: [],
}
