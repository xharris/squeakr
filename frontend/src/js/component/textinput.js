import React, { useEffect, useState, useRef } from "react"
import ContentEditable from "react-contenteditable"
import { cx } from "emotion"

import { block } from "style"

const bss = block("textinput")

const TextInput = ({
  defaultValue,
  onChange,
  className,
  multiline,
  disabled,
  ...inputProps
}) => {
  const el_editable = useRef()
  const [content, setContent] = useState(defaultValue || "")

  return (
    <ContentEditable
      className={cx(
        bss(),
        bss("editable", { line: multiline ? "multi" : "single", disabled }),
        className
      )}
      innerRef={el_editable}
      html={content}
      disabled={disabled}
      onChange={e => {
        const div = document.createElement("div")
        div.innerHTML = e.target.value
        const text = div.textContent || div.innerText || ""
        onChange && onChange(text)
        setContent(text)
      }}
      {...inputProps}
    />
  )
}

export default TextInput
