import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getThemeConfig } from "../theme";

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeContextProvider = ({ children }) => {
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

    const theme = useMemo(() => createTheme(getThemeConfig(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
