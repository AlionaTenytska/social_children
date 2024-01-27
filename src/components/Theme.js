import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme(
    {
        palette: {
            mode: 'light',
            primary: {
                main: 'rgb(255, 248, 28)',
            },
            error: {
                main: '#ff0000',
            },
        },
        Button: {
            size: 'large',
        },
        MuiStepper: {
            fontSize: '1rem'
        }
    }
);

export const Theme = ({ children }) => {
    return (<ThemeProvider theme={defaultTheme}>
        {children}
    </ThemeProvider>)
}