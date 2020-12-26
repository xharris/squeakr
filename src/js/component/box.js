import React from "react"
import { useThemeContext } from "feature/theme"
import { block, cx, css } from "style"

const bss = block("box")

const Box = ({
  className,
  color = "primary",
  bg = "secondary",
  amt = 4,
  ...props
}) => {
  const { getColor } = useThemeContext()
  return (
    <div
      className={cx(
        bss(),
        css({ borderRadius: 4, backgroundColor: getColor(color, bg, amt) }),
        className
      )}
      {...props}
    />
  )
}

export default Box
