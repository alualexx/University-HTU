import { createTheme } from "@mui/material/styles";

export const getThemeConfig = (mode) => ({
  palette: {
    mode,
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    background: {
      default: mode === "light" ? "#f8faff" : "#0a1929",
      paper: mode === "light" ? "#ffffff" : "#112233",
    },
    text: {
      primary: mode === "light" ? "#1e293b" : "#f8fafc",
      secondary: mode === "light" ? "#64748b" : "#94a3b8",
    },
    divider: mode === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: [
      "'Inter'",
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 16,
          boxShadow: mode === "light"
            ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
            : "0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === "light" ? "#0d2b6e" : "#071a45",
          color: "#ffffff",
          borderRight: "none",
        },
      },
    },
  },
});

const theme = {}; // Dummy to avoid breakage if imported elsewhere during transition
export default theme;
