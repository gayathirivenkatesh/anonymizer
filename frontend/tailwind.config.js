/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'anonymizer-dark': '#0d0d0d',
        'anonymizer-purple': '#4b1e6b',
        'anonymizer-indigo': '#2a0d3c',
      },
      backgroundImage: {
        'anonymizer-pattern': 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.02) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02) 0%, transparent 40%)',
      },
    },
  },
  plugins: [],
};
