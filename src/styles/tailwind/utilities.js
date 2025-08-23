const plugin = require("tailwindcss/plugin");

module.exports = plugin(({ addComponents }) => {
  addComponents({
    ".btn": {
      padding: "8px 16px",
      userSelect: "none",
      display: "flex",
      borderRadius: "6px",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      color: "var(--color-neutral-white)",
      backgroundColor: "var(--color-brand-blue-default)",
      transition: "all 0.2s ease",
      position: "relative",
      "@apply text-body-1-regular": {},
      "&:hover": {
        backgroundColor: "var(--color-brand-blue-light)",
        borderColor: "transparent",
        transform: "translateY(-3px) scale(1.01)",
      },
      "&:active, &[aria-expanded='true']": {
        boxShadow: "0 0 0 2px var(--color-brand-blue-default-40)",
        border: "transparent",
        transform: "scale(0.99)",
      },
    },
    ".btn-outline": {
      backgroundColor: "var(--color-neutral-white)",
      border: "1px solid var(--color-neutral-main-border)",
      color: "var(--color-brand-black)",
      transition: "all 0.2s ease",
      "@apply text-body-1-regular": {},

      // Hover normal de .btn-outline
      "&:hover": {
        backgroundColor: "var(--color-brand-blue-default)",
        color: "var(--color-neutral-white)",
        transition: "transform 0.3s ease",
        transform: "scale(1.03)",
      },

      "&:active": {
        border: "1px solid transparent",
        boxShadow: "0 0 0 2px var(--color-brand-blue-default-40)",
        outline: "none",
        transition: "all 0.1s ease",
      },

      // 👇 Esto aplica el fondo gris SOLO cuando no estás en hover
      "&.btn-outline-light-hover": {
        backgroundColor: "var(--color-neutral-main-border)",

        "&:hover": {
          backgroundColor: "var(--color-brand-blue-default) !important",
          color: "var(--color-neutral-white) !important",
          transform: "scale(1.03)",
        },
      },
    },
    ".btn-link": {
      padding: "0px 0px 0px 0px !important",
      backgroundColor: "transparent",
      border: "none",
      color: "var(--color-brand-red-dark)",
      "&:hover": {
        backgroundColor: "transparent",
        textShadow: "1px 1px 2px pink",
        border: "none",
        boxShadow: "none",
      },
      "&:focus": {
        backgroundColor: "transparent",
        outline: "none",
      },
    },
    ".btn-xs": {
      "@apply text-caption-1-medium": {},
      padding: "8px 12.5px 8px 12.5px",
    },
    ".btn-sm": {
      "@apply text-body-2-medium": {},
      padding: "8px 14.5px 8px 14.5px",
    },
    ".btn-lg": {
      padding: "8px 23px 8px 23px",
    },
    ".btn-xl": {
      padding: "12px 27px 12px 27px",
    },
    ".btn[disabled]": {
      backgroundColor: "rgb(42, 159, 205, 0.50)",
      boxShadow: "none",
    },
    ".btn-outline[disabled]": {
      backgroundColor: "rgb(0, 0, 0, 0.30)",
      color: "var(--color-neutral-white)",
      boxShadow: "none",
    },
    ".btn-link[disabled]": {
      backgroundColor: "transparent",
      color: "var(--color-brand-light)",
      textShadow: "none",
    },
    ".input": {
      padding: "8px 18px 8px 18px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      gap: "0.625rem",
      color: "var(--color-brand-black)",
      transition: "all 0.2s ease",
      "> lucide-angular, > span.prefix": {
        color: "hsl(var(--muted-foreground, 240 3.8% 46.1%))",
        transition: "color 0.2s ease",
      },
      "&.input-default": {
        border: "1px solid var(--color-neutral-main-border)",
        backgroundColor: "hsl(var(--muted, 240 4.8% 95.9%) / 0.5)",
        "&:focus-within": {
          border: "1px solid transparent",
          backgroundColor: "hsl(var(--background, 0 0% 100%))",
          boxShadow: "inset 0 0 0 2px var(--color-brand-blue-default-40)",
          "> lucide-angular, > span.prefix": {
            color: "var(--color-brand-black)",
          },
        },
        input: {
          "@apply ring-0": {},
        },
      },
      "&.input-disable": {
        color: "var(--color-brand-light)",
        border: "1px solid #E0E0E0",
        backgroundColor: "rgba(38, 38, 38, 0.2)",
      },
      "&.input-blocked": {
        color: "var(--color-brand-black)",
        border: "1px solid #E0E0E0",
        backgroundColor: "rgba(38, 38, 38, 0.1)",
      },
    },
    ".input-default input, .input-disable input, .input-blocked input": {
      outline: "none !important",
      border: "none !important",
      flex: "1",
      width: "100%",
      padding: "0px 0px !important",
      backgroundColor: "transparent",
      "@apply ring-0": {},
    },
    ".table-primary": {
      thead: {
        textTransform: "uppercase",
        tr: {
          th: {
            padding: "9px 16px",
            textAlign: "left",
            backgroundColor: "var(--color-brand-table-blue)",
            color: "var(--color-brand-black)",
            "@apply text-body-2-bold": {},
            whiteSpace: "nowrap",
          },
        },
      },
      tbody: {
        backgroundColor: "var(--color-brand-white)",
        "tr:hover": {
          backgroundColor: "var(--color-brand-table-light)",
        },
        tr: {
          td: {
            borderBottomWidth: "1px",
            borderColor: "var(--color-neutral-main-border)",
            padding: "10px 16px 10px 16px",
            whiteSpace: "nowrap",
          },
        },
        "tr:last-child": {
          td: {
            padding: "0.625rem 1rem",
          },
        },
      },
    },
    ".dropdown": {
      width: "100%",
      minWidth: "unset !important",
      boxShadow: "0px 0px 1px 0px rgba(9, 30, 66, 0.31), 0px 18px 28px 0px rgba(9, 30, 66, 0.15)",
      border: "solid 1px var(--color-neutral-main-border)",
      overflow: "hidden",
      ".dropdown-content": {
        backgroundColor: "var(--color-neutral-white)",
        display: "flex",
        maxHeight: "344px",
        overflow: "auto",
        flexDirection: "column",
        ".dropdown-option": {
          gap: "8px",
          padding: "10px 18px",
          borderBottom: "solid 1px var(--color-neutral-main-border)",
          "&:last-child": {
            borderBottom: "none",
          },
        },
      },
    },
    ".row-collapsable": {
      padding: "1rem",
      "@apply text-body-1-regular": {},
      border: "1px solid var(--color-neutral-main-border)",
      backgroundColor: "var(-color-neutral-white)",
    },
    ".tag": {
      display: "flex",
      gap: "8px",
      padding: "4px 8px",
      borderRadius: "8px",
      textSize: "10px",
      "@apply uppercase cursor-default font-bold w-fit h-fit items-center": {},
    },
    ".tooltip": {
      boxShadow: "var(--shadow-extra-large)",
      backgroundColor: "var(--color-neutral-white)",
      border: "1px solid var(--color-neutral-main-border)",
      borderRadius: "0px 8px 8px 8px",
      padding: "8px 12px",
    },
    ".select": {
      padding: "0.5rem 18px 0.5rem 0.5rem",
      "@apply border rounded-lg": {},
    },
    ".select-disable": {
      color: "#888888",
      backgroundColor: "var(--color-neutral-gray)",
    },
    ".flex-col-center": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    ".flex-row-center": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    ".button-outline": {
      padding: "6px 12px",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      border: "1px solid var(--color-neutral-main-border)",
      color: "var(--color-brand-black)",
      backgroundColor: "var(--color-neutral-white)",
      transition: "all 0.2s ease",
      position: "relative",
      "&:hover": {
        backgroundColor: "var(--color-brand-blue-default)",
        color: "var(--color-neutral-white)",
        borderColor: "transparent",
        transform: "translateY(-3px) scale(1.01)",
      },
      "&:active, &[aria-expanded='true']": {
        backgroundColor: "var(--color-brand-blue-default)",
        boxShadow: "0 0 0 2px var(--color-brand-blue-default-40)",
        transform: "scale(0.99)",
      },

      ".span-outline": {
        transition: "transform 0.2s ease",
        "@apply transition-transform": {},
        ".button-outline:hover &": {
          transform: "scale(1.10)",
        },
        ".button-outline[aria-expanded='true'] &": {
          transform: "scale(1.10)",
        },
      },

      ".icon-outline": {
        transition: "transform 0.2s ease",
        "@apply transition-transform": {},
        ".button-outline:hover &": {
          transform: "scale(1.10)",
        },
        ".button-outline[aria-expanded='true'] &": {
          transform: "scale(1.10)",
        },
      },
    },
    ".textarea": {
      padding: "8px 4px 8px 18px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      gap: "0.625rem",
      color: "var(--color-brand-black)",
      transition: "all 0.2s ease",
      "&.textarea-default": {
        border: "1px solid var(--color-neutral-main-border)",
        backgroundColor: "hsl(var(--background, 0 0% 100%))",
        "&:focus-within": {
          border: "1px solid transparent",
          boxShadow: "0 0 0 2px var(--color-brand-blue-default-40)",
          "> lucide-angular, > span.prefix": {
            color: "var(--color-brand-black)",
          },
        },
      },
      "&.textarea-disable": {
        color: "var(--color-brand-light)",
        border: "1px solid #E0E0E0",
        backgroundColor: "rgba(38, 38, 38, 0.2)",
      },
      "&.textarea-blocked": {
        color: "var(--color-brand-black)",
        border: "1px solid #E0E0E0",
        backgroundColor: "rgba(38, 38, 38, 0.1)",
      },
    },
    ".textarea-default textarea, .textarea-disable textarea, .textarea-blocked textarea": {
      outline: "none !important",
      border: "none !important",
      flex: "1",
      width: "100%",
      padding: "0px 14px 0px 0px !important",
      backgroundColor: "transparent",
      "@apply ring-0": {},
    },
    ".checkbox": {
      // Variables (puedes overridearlas por componente)
      "--cb-size": "30px",
      "--cb-input-focus": "var(--color-brand-blue-default)",
      "--cb-input-out-of-focus": "var(--color-neutral-main-border)",
      "--cb-bg-color": "var(--color-neutral-white)",
      "--cb-main-color": "var(--color-brand-black)",

      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      cursor: "pointer",
      userSelect: "none",

      // Input visualmente oculto pero accesible
      ".checkbox-input": {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        opacity: "0",
        margin: "0",
        cursor: "pointer",
      },

      // Caja visible
      ".checkbox-mark": {
        width: "var(--cb-size)",
        height: "var(--cb-size)",
        position: "relative",
        flex: "0 0 auto",
        border: "2px solid var(--cb-main-color)",
        borderRadius: "5px",
        boxShadow: "4px 4px var(--cb-main-color)",
        backgroundColor: "var(--cb-input-out-of-focus)",
        transition: "all 0.3s ease",
      },

      // Tick
      ".checkbox-mark::after": {
        content: '""',
        width: "7px",
        height: "15px",
        position: "absolute",
        top: "2px",
        left: "8px",
        display: "none",
        borderStyle: "solid",
        borderColor: "var(--cb-bg-color)",
        borderWidth: "0 2.5px 2.5px 0",
        transform: "rotate(45deg)",
      },

      // Estados
      ".checkbox-input:checked ~ .checkbox-mark": {
        backgroundColor: "var(--cb-input-focus)",
      },
      ".checkbox-input:checked ~ .checkbox-mark::after": {
        display: "block",
      },
      ".checkbox-input:focus-visible ~ .checkbox-mark": {
        boxShadow:
          "0 0 0 2px var(--color-brand-blue-default-40), 4px 4px var(--cb-main-color)",
        outline: "none",
      },
      ".checkbox-input:disabled ~ .checkbox-mark": {
        opacity: "0.5",
        cursor: "not-allowed",
      },
      ".checkbox-input:disabled ~ .checkbox-label": {
        opacity: "0.6",
        cursor: "not-allowed",
      },

      // Tamaños (ajustan caja y tick)
      "&.checkbox-sm": {
        "--cb-size": "20px",
      },
      "&.checkbox-lg": {
        "--cb-size": "36px",
      },

      // Variante redondeada extra
      "&.checkbox-rounded .checkbox-mark": {
        borderRadius: "8px",
      },
    },
  });
});
