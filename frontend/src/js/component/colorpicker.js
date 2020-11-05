import React, { useState, useEffect, useRef } from "react"
import { GithubPicker, CompactPicker } from "react-color"

import { block, css, cx, pickFontColor } from "style"
const bss = block("colorpicker")

const ColorPicker = ({ defaultValue, name, onChange, className }) => {
  const [color, setColor] = useState(defaultValue)
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
    console.log(color)
  }, [color])

  return (
    <div className={cx(bss(), className)} ref={ref_wrapper}>
      <button
        title="Choose a color"
        className={cx(
          bss("trigger"),
          css`
            background-color: ${color} !important;
            border: 1px solid ${pickFontColor(color)};
            box-shadow: 0px 0px 1px ${pickFontColor(color)};
          `
        )}
        onClick={() => setShow(!show)}
      />
      {show && (
        <CompactPicker
          className={bss("picker")}
          name={name}
          color={color}
          colors={[
            // red
            "#ffcdd2",
            "#ef9a9a",
            "#e57373",
            // purple
            "#E1BEE7",
            "#CE93D8",
            "#BA68C8",
            // blue
            "#BBDEFB",
            "#90CAF9",
            "#64B5F6",
            // green
            "#C8E6C9",
            "#A5D6A7",
            "#81C784",
            // yellow
            "#FFF9C4",
            "#FFF59D",
            "#FFF176",
            // orange
            "#FFE0B2",
            "#FFCC80",
            "#FFB74D",
            // brown
            "#D7CCC8",
            "#BCAAA4",
            "#A1887F",
            // gray
            "#E0E0E0",
            "#BDBDBD",
            "#9E9E9E"
          ]}
          onChangeComplete={e => {
            setColor(e.hex)
            console.log("changed", color, e.hex)
            onChange({ target: { name, value: e.hex } })
          }}
        />
      )}
    </div>
  )
}

export default ColorPicker
