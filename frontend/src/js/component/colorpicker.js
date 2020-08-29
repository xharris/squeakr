import React, { useState, useEffect, useRef } from "react"
import { GithubPicker } from "react-color"

import { block, css, cx, pickFontColor } from "style"
const bss = block("colorpicker")

const ColorPicker = ({ defaultValue, name, onChange, className }) => {
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

  useEffect(() => {
    console.log(defaultValue)
  }, [defaultValue])

  return (
    <div className={cx(bss(), className)} ref={ref_wrapper}>
      <button
        title="Choose a color"
        className={cx(
          bss("trigger"),
          css`
            background-color: ${defaultValue} !important;
            border: 1px solid ${pickFontColor(defaultValue)};
            box-shadow: 0px 0px 1px ${pickFontColor(defaultValue)};
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
