import React, { useEffect, useState, useRef } from "react"
import ContentEditable from "react-contenteditable"
import { cx } from "emotion"

import { block } from "style"

const bss = block("textinput")

const Input = ({ multiline, className, ...props }) => {
  const el_textarea = useRef()
  useEffect(() => {
    if (multiline && el_textarea) {
      const el = el_textarea.current
      el.style.height = "16px"
      el.style.height = 4 + el.scrollHeight + "px"
    }
  }, [])

  return multiline ? (
    <textarea
      className={className}
      ref={el_textarea}
      onKeyUp={e => {
        e.target.style.height = "16px"
        e.target.style.height = e.target.scrollHeight + "px"
      }}
      {...props}
    />
  ) : (
    <label className={className}>
      <input
        type="text"
        onInput={e => {
          if (e.target.parentNode.dataset)
            e.target.parentNode.dataset.value = e.target.value
        }}
        {...props}
      />
    </label>
  )
}

const TextInput = ({
  defaultValue,
  onChange,
  className,
  multiline,
  disabled,
  ...inputProps
}) => {
  const el_editable = useRef()
  const [content, setContent] = useState(defaultValue)

  return (
    <ContentEditable
      className={cx(
        bss(),
        bss("editable", { line: multiline ? "multi" : "single" }),
        className
      )}
      innerRef={el_editable}
      html={content}
      disabled={disabled}
      onChange={e => {
        onChange(e.target.value)
        setContent(e.target.value)
      }}
      {...inputProps}
    />
  )
}

export default TextInput
