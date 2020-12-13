import React from "react"
import { useThemeContext } from "feature/theme"
import { block, cx, css, pickFontColor } from "style"

const bss = block("text")

const Text = ({ className, children }) => {
  const { theme } = useThemeContext()
  return (
    <div
      className={cx(
        bss(),
        css({
          color: pickFontColor(theme.primary, theme.primary, 30)
        }),
        className
      )}
    >
      {children}
    </div>
  )
}

export default Text
