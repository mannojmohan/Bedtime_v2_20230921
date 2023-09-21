import React, { ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#005F66',
        },
        secondary: {
            main: '#c44507',
        },
    },
};


export function MyThemeProvider(props: {children?: ReactNode}) {
    return (
        <ThemeProvider theme={createTheme(themeOptions)} >
            {props.children}
        </ThemeProvider>
    );
}
