import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme(
    {
        palette: {
            mode: 'light',
            primary: {
                main: 'rgba(50,84,255,1)',
            },
            error: {
                main: '#ff0000',
            },
        },
        Button: {
            size: 'large',
        },
    }
);

export const Theme = ({ children }) => {
    return (<ThemeProvider theme={defaultTheme}>
        {children}
    </ThemeProvider>)
}