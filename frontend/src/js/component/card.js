import React from "react"
import { Link } from "react-router-dom"
import { css, cx, block, lightenDarken } from "style"

const bss = block("card")

const Card = ({ color, bgColor, className, thickness, to, ...props }) => {
  const style = cx(
    bss(),
    color &&
      css({
        border: `1px solid ${lightenDarken(color, -10)}`,
        borderRight: `1px solid ${lightenDarken(color, -10)}`,
        borderBottom: `1px solid ${lightenDarken(color, -10)}`,
        boxShadow: Array.from(
          { length: thickness || 2 },
          (v, i) => `${i}px ${i}px 0px 0px ${color}`
        ).join(","),
        background: bgColor
      }),
    className
  )

  return to ? (
    <Link to={to} className={style} {...props} />
  ) : (
    <div className={style} {...props} />
  )
}

export default Card
