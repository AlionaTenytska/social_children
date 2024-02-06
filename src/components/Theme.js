import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { dark } from '@mui/material/styles/createPalette';

const defaultTheme = createTheme(
    {
        palette: {
            // mode: 'light',
            primary: {
                main: 'rgb(22, 150, 22)',
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