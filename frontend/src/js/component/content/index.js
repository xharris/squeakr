import React, { useState, useCallback, useContext } from "react"
import { css, cx } from "emotion"

import { IconButton, LinkButton } from "component/button"
import Text from "component/content/text"
import ColorPicker from "component/colorpicker"
import TextInput from "component/textinput"
import ConfirmDialog from "component/modal/confirm"
import { CardContext } from "component/card"
import { Draggable } from "component/dragdrop"

import * as apiContent from "api/content"
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [settings, setSettings] = useState({
    color: color || "#ECEFF1",
    title,
    value
  })
  const [editing, setEditing] = useState()
  const { fetch: fetchCard } = useContext(CardContext)

  return (
    <Draggable
      className={bss({ size: size || "regular", type, editing })}
      dragType="content"
      render={({ preview }) => [
        <div key="main" className={bss("main")} ref={preview}>
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
              <LinkButton
                key="title"
                onClick={() => setEditing(true)}
                className={css`
                  color: ${pickFontColor(settings.color)};
                  border-bottom-color: ${pickFontColor(
                    settings.color
                  )} !important;
                `}
              >
                {settings.title}
              </LinkButton>
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
                    border-bottom: 1px solid ${pickFontColor(settings.color)};
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
        </div>,
        !editing && [
          <IconButton
            key="del_button"
            className={"delete"}
            icon={"Close"}
            onClick={() => setShowDeleteModal(true)}
            rounded
          />,
          <ConfirmDialog
            key="del_modal"
            open={showDeleteModal}
            prompt={`Delete content "${title}"?`}
            onYes={() => apiContent.remove(id).then(() => fetchCard())}
            onClose={() => setShowDeleteModal(false)}
          />
        ],
        editing && (
          <IconButton
            icon={"Check"}
            onClick={() => {
              if (editing && onChange) onChange(settings)
              setEditing(!editing)
            }}
          />
        )
      ]}
    />
  )
}

export default Content
