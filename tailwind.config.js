/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '1.8rem',
      },
      boxShadow: {
        'xxs': '0 0px 10px 5px rgba(0, 0, 0, 0.1)',
        'min': '0 0px 4px 3px rgba(0, 0, 0, 0.1)',
        'in': 'inset 0px 0px 8px 0px rgba(0,0,0,1.51)'
      },
      colors: {
        rojodualtron: '#BE0F2E',
        rojodualtronclaro: '#E8E8E7',
        rojodualtronfond: '#E8E8E7',
        negroclaro: '#ffffff24',
        negropopup: 'rgba(0, 0, 0, 0.563)',
        negroinput: '#282828',
        negrobox: '#161616',
        fondoinput: '#e3e3e3',
        plomoclaro: '#eaeaea',
      },
      fontFamily: {
        space: ['space', 'sans-serif'],
        spaceb: ['spaceb', 'sans-serif'],
        dmsans: ['dmsans', 'sans-serif']
      },
    }
  },
  plugins: [],
}
