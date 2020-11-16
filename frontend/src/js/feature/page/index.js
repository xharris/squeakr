import React, { useEffect, useState } from "react"
import Header from "feature/header"
import { block, cx, css } from "style"

const bss = block("page")

const Page = ({ theme, className, children, ...props }) => {
  return (
    <div
      className={cx(
        bss(),
        theme &&
          css({
            backgroundColor: theme.primary
          }),
        className
      )}
      {...props}
    >
      <Header />
      {children}
    </div>
  )
}

export default Page
