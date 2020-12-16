import React, { useEffect, useState } from "react"
import { useThemeContext } from "feature/theme"
import Header from "feature/header"
import Title from "feature/title"
import { block, cx, css } from "style"

const bss = block("page")

const Page = ({ className, children, title, ...props }) => {
  const { theme } = useThemeContext()
  return (
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
  )
}

export default Page
