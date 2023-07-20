import { createTheme, ThemeProvider as MUIStylesProvider } from '@mui/material/styles';

import { ThemeProvider } from '@shopify/restyle';
import theme from '@shared/ui/theme/AppTheme';

const themeM = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                    ':hover': {
                        backgroundColor: 'inherit !important'
                    }
                }
            }
        },
        MuiOutlinedInput: {

            styleOverrides: {
                /*      root: {
                          borderRadius: 8
                      },
                      notchedOutline: {
                          borderColor: theme.colors.contrastLight
                      },
                      focused: {
                          borderColor: theme.colors.contrastLight
                      }*/
                notchedOutline: {
                    border: 0
                },
                focused: {
                    border: 0
                },
                input: {
                    border: 0
                }
            }
        },
        MuiAutocomplete: {
            styleOverrides: {

                inputFocused: {
                    borderColor: theme.colors.contrastLight
                },
                focused: {
                    borderColor: theme.colors.contrastLight
                }
                /*  inputFocused: {
                      border: 0,
                      outline: 'none'
                  },
                  input: {
                      border: 0,
                      outline: 'none'
                  }*/
            }
        }
    }
});

export function StylesProvider({ theme, children }) {
    return (
            <MUIStylesProvider
                    theme={themeM}
            >
                <ThemeProvider theme={theme}>
                    {children}
                </ThemeProvider>
            </MUIStylesProvider>
    );
}