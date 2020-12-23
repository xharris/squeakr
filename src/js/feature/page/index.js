import React, { useEffect, useState } from "react"
import { useThemeContext } from "feature/theme"
import Header from "feature/header"
import Title from "feature/title"
import ThemeProvider, { ThemeContext } from "feature/theme"
import { useListen } from "util"
import { block, cx, css } from "style"

const bss = block("page")

const Page = ({ className, children, title, theme, ...props }) => {
  useListen()

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div
            className={cx(
              bss(),
              css({
                backgroundColor: theme.primary
              }),
              className
            )}
            {...props}
          >
            <Title>{title}</Title>
            <Header />
            {children}
          </div>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  )
}

export default Page
