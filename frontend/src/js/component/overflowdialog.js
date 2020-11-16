import React, { useState, useEffect, useRef } from "react"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"

import { block } from "style"

const bss = block("overflowdialog")

const OverflowDialog = ({ open: _open, onClose, children }) => {
  const [open, setOpen] = useState(_open)
  useEffect(() => {
    setOpen(_open)
  }, [_open])
  const ref_children = useRef()

  return (
    <div className={bss({ open })}>
      {open && (
        <div
          className={bss("children")}
          onClick={e => {
            if (e.target === ref_children.current) {
              if (onClose) {
                onClose(v => setOpen(v))
              } else setOpen(false)
            }
          }}
          ref={ref_children}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default OverflowDialog
