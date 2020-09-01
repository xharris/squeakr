import React, { useState } from "react"
import { cx } from "emotion"

import { block } from "style"

const bss = block("textinput")

const Input = ({ multiline, ...props }) =>
  multiline ? (
    <textarea
      onKeyUp={e => {
        e.target.style.height = "16px"
        e.target.style.height = e.target.scrollHeight + "px"
      }}
      {...props}
    />
  ) : (
    <input type="text" {...props} />
  )

const TextInput = ({
  defaultValue,
  onChange,
  className,
  multiline,
  ...inputProps
}) => {
  return (
    <Input
      className={cx(
        bss(),
        bss("editable", { line: multiline ? "multi" : "single" }),
        className
      )}
      onChange={e => onChange(e.target.value)}
      defaultValue={defaultValue}
      multiline={multiline}
      {...inputProps}
    />
  )
}

export default TextInput
