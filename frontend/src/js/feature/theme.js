import React, { useState, useEffect, createContext, useContext } from "react"
import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles"

const ThemeContext = createContext({
  theme: {
    primary: "#E0E0E0",
    secondary: "#FFFFFF",
    font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif`,
    header_char: "\\"
  },
  setTheme: () => {}
})

export const useThemeContext = () => useContext(ThemeContext)

const ThemeProvider = ({ theme: _theme, children }) => {
  const [theme, setTheme] = useState(
    _theme
      ? _theme
      : {
          primary: "#E0E0E0",
          secondary: "#FFFFFF",
          font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif`,
          header_char: "\\"
        }
  )
  const [muiTheme, setMuiTheme] = useState(
    createMuiTheme({
      palette: {
        primary: {
          main: "#E0E0E0"
        },
        secondary: {
          main: "#FFFFFF"
        }
      }
    })
  )
  useEffect(() => {
    if (_theme) setTheme(_theme)
  }, [_theme])
  useEffect(() => {
    setMuiTheme(
      createMuiTheme({
        palette: {
          primary: {
            main: theme.primary
          },
          secondary: {
            main: theme.secondary
          }
        }
      })
    )
  }, [theme])

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeContext.Provider
        value={{ theme, setTheme: t => setTheme(t || theme) }}
      >
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export default ThemeProvider
