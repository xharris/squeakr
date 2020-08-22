import React from "react"
import Dialog from "."
import { IconButton } from "component/button"

const AddContentDialog = ({ open, onClose, onSelect }) => (
  <Dialog className={"addcontentdialog"} onClose={onClose} open={open}>
    <IconButton
      icon="Subject"
      onClick={() => {
        onSelect("text")
        onClose()
      }}
    />
  </Dialog>
)

export default AddContentDialog
