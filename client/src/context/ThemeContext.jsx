import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { getThemeConfig } from "../theme";

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeContextProvider = ({ children }) => {
    const location = useLocation();
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem("themeMode");
        return savedMode ? savedMode : "light";
    });

    useEffect(() => {
        localStorage.setItem("themeMode", mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
            mode,
        }),
        [mode]
    );

    const portalType = useMemo(() => {
        const path = location.pathname;
        if (
            path.includes("student") ||
            path.includes("login") ||
            path.includes("register") ||
            path === "/" ||
            path.includes("courses") ||
            path.includes("apply") ||
            path.includes("about")
        ) {
            return "student";
        }
        return "admin";
    }, [location.pathname]);

    const theme = useMemo(() => createTheme(getThemeConfig(mode, portalType)), [mode, portalType]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
