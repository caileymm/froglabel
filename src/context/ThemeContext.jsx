import { createContext, useState, useMemo, useEffect } from 'react';
import { defaultColors, frogThemeColors } from '../utils/theme';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [frogTheme, setFrogTheme] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = frogTheme
            ? frogThemeColors.background
            : defaultColors.background;
    }, [frogTheme]);

    const theme = frogTheme ? frogThemeColors : defaultColors;
    const value = useMemo(
        () => ({ theme, frogTheme, setFrogTheme }),
        [theme, frogTheme],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}