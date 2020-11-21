import React, { useState, useEffect, createContext, useContext } from "react"

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
  useEffect(() => {
    if (_theme) setTheme(_theme)
  }, [_theme])
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
