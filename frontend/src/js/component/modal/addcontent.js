import React, { useState } from "react"
import Dialog from "."
import { IconButton } from "component/button"

import { block } from "style"

const Buttons = ({ onSelect }) => [
  <IconButton
    key="card"
    icon="FeaturedPlayList"
    title="Card"
    onClick={() => {
      onSelect("card", {
        type: "card"
      })
    }}
  />,
  <IconButton
    key="text"
    icon="Subject"
    title="Text"
    onClick={() => {
      onSelect("text", {
        type: "text",
        title: "title",
        value: "description"
      })
    }}
  />
]

const bss = block("addcontentbuttons")

/* show the most recently used buttons */
const AddContentButton = ({ onSelect, expanded }) => {
  return (
    <div className={bss()}>
      {expanded && <Buttons onSelect={onSelect} />}
      <IconButton
        className={"addcontent"}
        icon={"Add"}
        variant="contained"
        popover={<Buttons onSelect={onSelect} />}
      />
    </div>
  )
}

export default AddContentButton
