import React from "react"

import { block } from "style"
import "style/content.scss"

const bss = block("content")

const Content = ({ type, value, isMini }) => (
  <div className={bss({ mini: isMini, type })}>{value}</div>
)

export default Content
