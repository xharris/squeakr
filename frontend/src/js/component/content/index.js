import React, { useState, useCallback } from "react"
import { css, cx } from "emotion"

import IconButton from "component/iconbutton"
import Text from "component/content/text"
import ColorPicker from "component/colorpicker"
import TextInput from "component/textinput"

import { block, pickFontColor } from "style"
const bss = block("content")

/*

Content Types:
- Text
- Time (hms, date)


*/

const EditTitle = ({ title, color, onChange }) => {
  const inputChange = useCallback((name, value) => onChange(name, value))

  return (
    <div
      className={cx(
        css`
          background-color: ${color || "#ECEFF1"};
        `,
        bss("title-form")
      )}
    >
      <TextInput
        type="text"
        name="title"
        defaultValue={title}
        onChange={v => inputChange("title", v)}
        className={css`
          color: ${pickFontColor(color || "#ECEFF1")};
          border-color-bottom: ${pickFontColor(color || "#ECEFF1")};
        `}
      />
      <ColorPicker
        name="color"
        defaultValue={color}
        onChange={e => inputChange(e.target.name, e.target.value)}
      />
    </div>
  )
}

const Content = ({ id, type, value, size, color, title, onChange }) => {
  const [settings, setSettings] = useState({
    color: color || "#ECEFF1",
    title,
    value
  })
  const [editing, setEditing] = useState()

  return (
    <div className={bss({ size: size || "regular", type, editing })}>
      <div
        className={cx(
          css`
            background-color: ${settings.color};
            color: ${pickFontColor(settings.color)};
          `,
          bss("title")
        )}
      >
        {!editing ? (
          settings.title
        ) : (
          <div
            className={cx(
              css`
                background-color: ${settings.color};
              `,
              bss("title-form")
            )}
          >
            <TextInput
              type="text"
              name="title"
              defaultValue={title}
              onChange={v => setSettings({ ...settings, title: v })}
              className={css`
                color: ${pickFontColor(settings.color)};
                border-color-bottom: ${pickFontColor(settings.color)};
              `}
            />
            <ColorPicker
              name="color"
              defaultValue={settings.color}
              onChange={e =>
                setSettings({ ...settings, color: e.target.value })
              }
            />
          </div>
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
        {type === "text" ? (
          !editing ? (
            <Text.View value={value} />
          ) : (
            <Text.Edit
              value={value}
              onChange={v => setSettings({ ...settings, value: v })}
            />
          )
        ) : null}
      </div>
      <IconButton
        icon={editing ? "Check" : "Edit"}
        onClick={() => {
          if (editing && onChange) onChange(settings)
          setEditing(!editing)
        }}
      />
    </div>
  )
}

export default Content
