import React from "react"
import * as Icons from "@material-ui/icons"
import { cx, block } from "style"

const bss = block("icon")

export const Icon = ({ icon, className, ...props }) => {
  const FinalIcon = Icons[icon]
  return <FinalIcon className={cx(bss(), className)} {...props} />
}

export default Icon
