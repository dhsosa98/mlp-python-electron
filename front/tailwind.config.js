module.exports = {
  darkMode: 'class',
  purge: {
    enabled: true,
    content: ["./src/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
    },
  theme: {
    extend: { 
      gridTemplateRows: {
      // Simple 10 row grid
      '10': 'repeat(10, minmax(0, 1fr))',},
    }
  },
  plugins: [],
}
