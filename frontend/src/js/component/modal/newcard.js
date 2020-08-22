import React from "react"
import Modal from "@material-ui/core/Modal"
import Form from "component/form"

import { block } from "style"
const bss = block("newcardmodal")

const NewCardModal = ({ open, onClose, onSubmit }) => {
  return (
    <Modal className={bss()} open={open} onClose={onClose}>
      <div className={bss("content")}>
        <h2 className={bss("title")}>Create new card</h2>
        <Form
          onSave={d => {
            onClose()
            onSubmit(d)
          }}
          render={({ Input }) => [<Input key="title" label="title" />]}
        />
      </div>
    </Modal>
  )
}

export default NewCardModal
