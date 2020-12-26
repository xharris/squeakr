import React from "react"
import { useThemeContext } from "feature/theme"
import { block, cx, css, pickFontColor } from "style"

const bss = block("text")

const Text = ({
  className,
  themed,
  color = "primary",
  bg = "secondary",
  amt = 20,
  children,
  ...props
}) => {
  const { theme, getColor } = useThemeContext()
  return (
    <div
      className={cx(
        bss(),
        css({
          color: themed && getColor(color, bg, amt)
        }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Text
