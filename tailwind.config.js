// tailwind.config.js
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,vue}", // Ajusta esto según la estructura de tu proyecto
    ],
    theme: {
      extend: {
        colors: {
          // Puedes extender los colores aquí si es necesario
        },
      },
    },
    // plugins: [
    //   require('daisyui'),
    // ],
    // daisyui: {
    //   themes: [
    //     {
    //       light: {
    //         "primary": "#102C57", // Color personalizado para btn-primary en tema claro
    //         "secondary": "#1679AB", // Color secundario personalizado
    //         "accent": "#FFB1B1",
    //         "neutral": "#3D4451",
    //         "base-100": "#FFFFFF",
    //         "info": "#3ABFF8",
    //         "success": "#36D399",
    //         "warning": "#FBBD23",
    //         "error": "#F87272",
    //       },
    //     },
    //     {
    //       dark: {
    //         "primary": "#4C51BF", // Color personalizado para btn-primary en tema oscuro
    //         "secondary": "#A0AEC0", // Color secundario personalizado
    //         "accent": "#D53F8C",
    //         "neutral": "#2D3748",
    //         "base-100": "#1A202C",
    //         "info": "#63B3ED",
    //         "success": "#48BB78",
    //         "warning": "#ED8936",
    //         "error": "#E53E3E",
    //       },
    //     },
    //     // Otros temas disponibles de DaisyUI
    //   ],
    // },
  };
  