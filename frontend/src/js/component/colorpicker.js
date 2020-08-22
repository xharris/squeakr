import React, { useState, useEffect, useRef } from "react"
import { GithubPicker } from "react-color"

import { block, css } from "style"
const bss = block("colorpicker")

const ColorPicker = ({ defaultValue, name, onChange }) => {
  const [show, setShow] = useState()
  const ref_wrapper = useRef()

  const clickOut = e =>
    ref_wrapper.current && ref_wrapper.current.contains(e.target)
      ? null
      : setShow(false)

  useEffect(() => {
    document.addEventListener("mousedown", clickOut)
    return () => document.removeEventListener("mousedown", clickOut)
  }, [])

  return (
    <div className={bss()} ref={ref_wrapper}>
      <button
        className={bss(
          "trigger",
          css`
            background-color: ${defaultValue} !important;
          `
        )}
        onClick={() => setShow(!show)}
      />
      {show && (
        <GithubPicker
          className={bss("picker")}
          name={name}
          defaultValue={defaultValue}
          onChangeComplete={e => onChange({ target: { name, value: e.hex } })}
        />
      )}
    </div>
  )
}

export default ColorPicker
