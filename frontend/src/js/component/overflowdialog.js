import React, { useState, useEffect, useRef } from "react"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Button from "component/button"

import { block } from "style"

const bss = block("overflowdialog")

const OverflowDialog = ({
  open: _open,
  onClose,
  closeButton,
  centered,
  children
}) => {
  const [open, setOpen] = useState(_open)
  useEffect(() => {
    setOpen(_open)
  }, [_open])
  const ref_children = useRef()

  return (
    <div className={bss({ open, centered })}>
      {open && [
        closeButton && (
          <Button
            key="close"
            className={bss("close")}
            icon="Close"
            onClick={() => onClose(false)}
            bg="#ffffff"
            outlined
          />
        ),
        <div
          key="children"
          className={bss("children")}
          onClick={e => {
            if (e.target === ref_children.current && !closeButton) {
              if (onClose) {
                onClose(v => setOpen(v))
              } else setOpen(false)
            }
          }}
          ref={ref_children}
        >
          {children}
        </div>
      ]}
    </div>
  )
}

export default OverflowDialog
