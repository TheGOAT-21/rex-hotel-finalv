// tailwind.config.js
export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Couleurs principales
        "primary": "#E0C989", // Or/Doré - couleur signature
        "background": "#000000", // Noir profond
        "background-alt": "#1D1D1D", // Noir nuancé
        "text": "#FFFFFF", // Blanc pour le texte
        "accent": "#F5EFE0", // Beige clair pour les accents subtils
        
        // Variations de l'or
        "primary-hover": "#E8D4A1", // Version plus claire pour hover
        "primary-active": "#D4BC7D", // Version plus foncée pour état actif
        
        // Couleurs sémantiques
        "error": "#FF4D4D",
        "success": "#4CAF50",
        "info": "#2196F3",
        
        // Niveaux de noir pour la hiérarchie visuelle
        "dark": {
          DEFAULT: "#000000",
          "100": "#1D1D1D",
          "200": "#2D2D2D",
          "300": "#3D3D3D"
        }
      },
      fontFamily: {
        "title": ["Montserrat", "sans-serif"], // Police pour les titres, à adapter selon la police choisie
        "body": ["Raleway", "sans-serif"] // Police pour le corps de texte
      },
      fontSize: {
        // Hiérarchie typographique
        "display": ["48px", { lineHeight: "1.2", letterSpacing: "0.05em" }],
        "h1": ["36px", { lineHeight: "1.2", letterSpacing: "0.05em" }],
        "h2": ["30px", { lineHeight: "1.3", letterSpacing: "0.04em" }],
        "h3": ["24px", { lineHeight: "1.4", letterSpacing: "0.03em" }],
        "base": ["16px", { lineHeight: "1.6" }],
        "lg": ["18px", { lineHeight: "1.6" }]
      },
      spacing: {
        // Espacements standards
        "section": "120px",
        "container": "64px"
      },
      borderRadius: {
        // Coins arrondis subtils
        DEFAULT: "4px",
        "lg": "8px"
      },
      boxShadow: {
        // Ombres élégantes
        'elegant': '0 4px 20px rgba(224, 201, 137, 0.1)'
      },
      transitionDuration: {
        // Transitions fluides
        DEFAULT: '300ms'
      }
    }
  },
  plugins: []
}