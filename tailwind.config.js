/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
      extend: {
        colors: {
          // Main colors
          "primary": "#D4AF37", // Or Royal
          "background": "#121212", // Noir Profond
          "background-alt": "#1E1E1E", // Gris Anthracite
          "text": "#FFFFF0", // Blanc Ivoire
          
          // Secondary colors
          "secondary": "#0F1E2D", // Bleu Nuit
          "accent": "#483C32", // Gris Taupe
          "bordeaux": "#800020",
          "emerald": "#046307", // Vert Émeraude
          
          // State colors
          "primary-hover": "#E6C158", // Or clair
          "primary-active": "#B89030", // Or foncé
          "success": "#2E7D32",
          "error": "#C62828",
          "info": "#1976D2",
          "disabled": "#5E5E5E",
          
          // Extended dark palette
          "dark": {
            DEFAULT: "#121212",
            "100": "#1E1E1E",
            "200": "#2A2A2A",
            "300": "#3A3A3A"
          }
        },
        fontFamily: {
          "title": ["Playfair Display", "serif"],
          "body": ["Montserrat", "sans-serif"]
        },
        backgroundImage: {
          "gradient-premium": "linear-gradient(to bottom, #121212, #1E1E1E)",
          "gradient-gold": "linear-gradient(to bottom, #D4AF37, #B89030)",
          "overlay-card": "radial-gradient(circle, rgba(18, 18, 18, 0.85), rgba(18, 18, 18, 0.95))"
        }
      }
    },
    plugins: []
  }