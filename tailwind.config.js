// tailwind.config.js
export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Couleurs principales
        "primary": "#D4AF37",
        "background": "#121212",
        "background-alt": "#1E1E1E",
        "text": "#FFFFF0",
        
        // Couleurs secondaires
        "secondary": "#0F1E2D",
        "accent": "#483C32",
        "error": "#C62828",
        "success": "#2E7D32",
        "info": "#1976D2",
        "disabled": "#5E5E5E",
        
        // Variations
        "primary-hover": "#E6C158",
        "primary-active": "#B89030",
        
        // Couleurs dark
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
      }
    }
  },
  plugins: []
}