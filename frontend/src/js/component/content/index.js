import React, { useState, useCallback } from "react"
import { css, cx } from "emotion"

import IconButton from "component/iconbutton"
import { Text } from "component/content/text"
import ColorPicker from "component/colorpicker"

import { block, pickFontColor } from "style"
const bss = block("content")

/*

Content Types:
- Text
- Time (hms, date)


*/

const EditTitle = ({ title, color, onChange }) => {
  const inputChange = useCallback(e => {
    onChange(e.target.name, e.target.value)
  })

  return (
    <div
      className={cx(
        css`
          background-color: ${color || "#ECEFF1"};
        `,
        bss("title-form")
      )}
    >
      <input
        type="text"
        name="title"
        defaultValue={title}
        onChange={inputChange}
        className={css`
          color: ${pickFontColor(color || "#ECEFF1")};
          border-color-bottom: ${pickFontColor(color || "#ECEFF1")};
        `}
      />
      <ColorPicker name="color" defaultValue={color} onChange={inputChange} />
    </div>
  )
}

const Content = ({ id, type, value, size, color, title }) => {
  const [settings, setSettings] = useState({ color, title })
  const [editing, setEditing] = useState()

  return (
    <div className={bss({ size: size || "regular", type, editing })}>
      <div
        className={cx(
          css`
            background-color: ${settings.color || "#ECEFF1"};
            color: ${pickFontColor(settings.color || "#ECEFF1")};
          `,
          bss("title")
        )}
      >
        {!editing ? (
          settings.title
        ) : (
          <EditTitle
            title={settings.title}
            color={settings.color}
            onChange={(name, value) =>
              setSettings({ ...settings, [name]: value })
            }
          />
        )}
      </div>
      <div
        className={cx(
          css`
            ${settings.color ? `border-color: ${settings.color};` : ""}
          `,
          bss("body")
        )}
      >
        {type === "text" ? <Text value={value} /> : null}
      </div>
      <IconButton
        icon={editing ? "Check" : "Edit"}
        onClick={() => setEditing(!editing)}
      />
    </div>
  )
}

export default Content
