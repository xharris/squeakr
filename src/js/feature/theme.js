import React, { useState, useEffect, createContext, useContext } from "react"
import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles"

const default_theme = {
  primary: "#F5F5F5",
  secondary: "#FFFFFF",
  font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif`,
  header_char: "\\"
}

const ThemeContext = createContext({
  theme: default_theme,
  setTheme: () => {}
})

export const useThemeContext = () => useContext(ThemeContext)

const ThemeProvider = ({ theme: _theme, children }) => {
  const [theme, setTheme] = useState(_theme || default_theme)
  const [muiTheme, setMuiTheme] = useState(
    createMuiTheme({
      palette: {
        primary: {
          main: default_theme.primary
        },
        secondary: {
          main: default_theme.secondary
        }
      }
    })
  )
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
  useEffect(() => {
    if (_theme) setTheme(_theme)
  }, [_theme])

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
