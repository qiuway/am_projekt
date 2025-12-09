import React, { createContext, useState } from 'react';

export const themes = {
    default: {
        name: "Domyślny",
        background: 'rgba(216, 252, 230, 1)',
        text: '#2E3D35',
        accent: '#5FA777',  
    },
    blue: {
        name: "Błękitny spokój",
        background: "#eaf6ff",
        text: "#1b2a41",
        accent: "#6baed6",
    },
    mint: {
        name: "Miętowa świeżość",
        background: "#e7f8f3",
        text: "#1c2b2d",
        accent: "#8fd3a9",
    },
    lavender: {
        name: "Lawendowy relaks",
        background: "#f2ecfa",
        text: "#2a2438",
        accent: "#b497e7",
    },
    sand: {
        name: "Ciepły piasek",
        background: "#f8f1e4",
        text: "#3c2f2f",
        accent: "#d1b38e",
    },
};

export const ThemeContext = createContext({
    theme: themes.default,
    setTheme: () => { },
});

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(themes.default);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
