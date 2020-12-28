import React, { useEffect, useState } from "react"
import Header from "feature/header"
import Title from "feature/title"
import ThemeProvider from "feature/theme"
import { block, cx, css } from "style"

const bss = block("page")

const Page = ({ className, children, title, theme, ...props }) => {
  return (
    <div
      className={cx(
        bss(),
        css({
          backgroundColor: theme && theme.primary
        }),
        className
      )}
      {...props}
    >
      <ThemeProvider theme={theme}>
        <Title>{title}</Title>
        <Header />
      </ThemeProvider>
      {children}
    </div>
  )
}

export default Page
