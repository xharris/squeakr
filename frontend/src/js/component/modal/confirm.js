import React from "react"
import Dialog from "."
import { IconButton } from "component/button"

import { block } from "style"
const bss = block("confirmdialog")

const ConfirmDialog = ({ open, prompt, onYes, onNo, onClose }) => (
  <Dialog className={"confirmdialog"} onClose={onClose} open={open}>
    <div className={bss("prompt")}>{prompt}</div>
    <div className={bss("choices")}>
      <IconButton
        icon="Check"
        onClick={() => {
          if (onYes) onYes()
          if (onClose) onClose()
        }}
      />
      <IconButton
        icon="Close"
        onClick={() => {
          if (onNo) onNo()
          if (onClose) onClose()
        }}
      />
    </div>
  </Dialog>
)

export default ConfirmDialog
