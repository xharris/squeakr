import React from "react"
import { Dialog as MatDialog } from "@material-ui/core"

import { block, cx } from "style"
const bss = block("dialog")

const Dialog = ({ className, open, onClose, children }) => {
  return (
    <MatDialog
      open={open}
      className={cx(bss(), className)}
      onClose={() => {
        if (onClose) onClose()
      }}
      open={open}
    >
      {children}
    </MatDialog>
  )
}

export default Dialog
