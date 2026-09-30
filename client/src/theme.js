import { createTheme } from "@mui/material/styles";

export const HTTU_COLORS = {
  navy: "#0E2033",
  navyLight: "#1A334E",
  navyDark: "#081421",
  gold: "#D9A621",
  goldLight: "#E8BD4D",
  goldDark: "#B88714",
  teal: "#12808C",
  tealLight: "#1AA5B5",
  tealDark: "#0D6069",
  canvas: "#F4F6F8",
  canvasDark: "#07111D",
  cardBorder: "rgba(226, 232, 240, 0.8)",
  cardBorderDark: "rgba(255, 255, 255, 0.08)"
};

export const getThemeConfig = (mode = "light") => {
  const isLight = mode === "light";

  return {
    palette: {
      mode,
      primary: {
        main: HTTU_COLORS.navy,
        light: HTTU_COLORS.navyLight,
        dark: HTTU_COLORS.navyDark,
        contrastText: "#ffffff",
      },
      secondary: {
        main: HTTU_COLORS.gold,
        light: HTTU_COLORS.goldLight,
        dark: HTTU_COLORS.goldDark,
        contrastText: "#0E2033",
      },
      info: {
        main: HTTU_COLORS.teal,
        light: HTTU_COLORS.tealLight,
        dark: HTTU_COLORS.tealDark,
        contrastText: "#ffffff",
      },
      background: {
        default: isLight ? HTTU_COLORS.canvas : HTTU_COLORS.canvasDark,
        paper: isLight ? "#ffffff" : HTTU_COLORS.navy,
      },
      text: {
        primary: isLight ? "#1A202C" : "#F7FAFC",
        secondary: isLight ? "#4A5568" : "#A0AEC0",
      },
      divider: isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)",
    },
    typography: {
      fontFamily: [
        "'Inter'",
        "'Noto Sans Ethiopic'",
        "'Abyssinica SIL'",
        "-apple-system",
        "BlinkMacSystemFont",
        "'Segoe UI'",
        "Roboto",
        "sans-serif",
      ].join(","),
      h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 900 },
      h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 800 },
      h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 800 },
      h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
      h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
      h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
      button: { fontWeight: 700, letterSpacing: "0.02em", textTransform: "none" },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isLight 
              ? "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)" 
              : "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
            border: isLight ? `1px solid ${HTTU_COLORS.cardBorder}` : `1px solid ${HTTU_COLORS.cardBorderDark}`,
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            },
          },
          containedSecondary: {
            color: "#0E2033",
            fontWeight: 800,
          }
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: HTTU_COLORS.navy,
            color: "#ffffff",
          },
        },
      },
    },
  };
};

export const createCustomTheme = (mode, portalType) => {
  return createTheme(getThemeConfig(mode, portalType));
};

export default createCustomTheme("light");
