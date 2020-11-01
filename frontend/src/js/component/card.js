import React from "react"
import { css, cx, block } from "style"

const bss = block("card")

const Card = ({ color, className, ...props }) => (
  <div className={cx(bss(), className)} {...props} />
)

export default Card
