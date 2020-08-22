import React, { useState } from "react"
import { cx } from "emotion"

import { block } from "style"

const bss = block("textinput")

const TextInput = ({
  defaultValue,
  onChange,
  className,
  multiline,
  ...inputProps
}) => (
  <p className={cx(bss({ line: multiline ? "multi" : "single" }), className)}>
    <span
      className={bss("editable")}
      role="textbox"
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={e => onChange(e.currentTarget.textContent)}
      onBlur={e => onChange(e.currentTarget.textContent)}
      {...inputProps}
    >
      {defaultValue}
    </span>
  </p>
)

export default TextInput
