import React, { useState } from "react"
import { cx, css, block } from "style"

const bss = block("textarea")

const TextArea = ({ className, color, ...props }) => (
  <textarea
    className={cx(
      bss(),
      className,
      css({
        [":hover"]: {
          border: `1px solid ${color || "#bdbdbd"}`,
          boxShadow: `0px 0px 3px 1px ${color || "#bdbdbd"}`
        }
      })
    )}
    {...props}
  />
)

export default TextArea
