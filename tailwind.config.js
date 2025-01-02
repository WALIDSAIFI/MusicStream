/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Vous pouvez ajouter vos personnalisations ici
      colors: {
        'primary': '#1DB954',  // Couleur principale (style Spotify)
        'dark': '#121212',     // Fond sombre
        'light': '#282828'     // Fond plus clair
      }
    },
  },
  plugins: [],
  // Configuration pour la production
  mode: 'jit', // Just-In-Time Mode
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{html,ts}',
    ]
  }
} 