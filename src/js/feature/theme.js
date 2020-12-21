import React, { useState, useEffect, createContext, useContext } from "react"
import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles"
import * as apiUser from "api/user"
import { css, pickFontColor } from "style"

const default_theme = {
  primary: "#F5F5F5",
  secondary: "#F5F5F5",
  font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif`,
  header_char: "\\"
}

export const ThemeContext = createContext({
  theme: default_theme,
  color: () => {},
  setTheme: () => {}
})

export const useThemeContext = () => useContext(ThemeContext)

const ThemeProvider = ({ theme: _theme, username, children }) => {
  const [user_theme, fetchTheme] = apiUser.useTheme(
    () => username && fetchTheme(username)
  )

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
    if (user_theme || _theme) setTheme(user_theme || _theme)
  }, [_theme, user_theme])

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeContext.Provider
        value={{
          theme,
          getColor: (fg, bg, num) =>
            pickFontColor(
              theme[fg] || fg || theme.primary,
              theme[bg] || bg || theme[fg] || theme.secondary,
              num
            ),
          setTheme: t => setTheme(t || theme)
        }}
      >
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export default ThemeProvider
