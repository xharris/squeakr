import React, { useState, useEffect } from "react"
import { css, cx } from "emotion"

import { IconButton, LinkButton } from "component/button"
import Text from "component/content/text"
import ColorPicker from "component/colorpicker"
import TextInput from "component/textinput"
import ConfirmDialog from "component/modal/confirm"
import { DragDrop } from "component/dragdrop"

import { useFetch, notify } from "util"
import * as apiCard from "api/card"
import { block, pickFontColor } from "style"
const bss = block("content")

/*

Content Types:
- Text
- Time (hms, date)


*/

const Content = ({ id, parent, onChange }) => {
  const [data, fetchData, innerNotify] = useFetch(
    () => apiCard.get(id),
    "content",
    id
  )
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [settings, setSettings] = useState({
    color: "#ECEFF1"
  })
  const [editing, setEditing] = useState()

  const { type, color, size, title, value } = settings

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (data) setSettings({ ...data })
  }, [data])

  return (
    <DragDrop
      className={bss({ size: size || "regular", type, editing })}
      id={id}
      info={{ id: id, type: "content", parent }}
      draggable={!editing}
    >
      <div className={bss("main")}>
        <div
          className={cx(
            css`
              ${color ? `border-color: ${color};` : ""}
            `,
            bss("body")
          )}
        >
          {editing && (
            <ColorPicker
              name="color"
              defaultValue={color}
              onChange={e =>
                setSettings({ ...settings, color: e.target.value })
              }
              className={css`
                height: 100%;
                width: 18px;
              `}
            />
          )}
          {type === "text" ? (
            !editing ? (
              [
                <div
                  className={css`
                    display: flex;
                  `}
                  onClick={() => setEditing(true)}
                >
                  <Text.View key="text.view" value={value} />
                </div>,
                <IconButton
                  key="del_button"
                  className={"delete"}
                  icon={"Close"}
                  onClick={() => setShowDeleteModal(true)}
                />
              ]
            ) : (
              <Text.Edit
                value={value}
                onChange={v => setSettings({ ...settings, value: v })}
              />
            )
          ) : null}
        </div>
      </div>
      {editing && (
        <IconButton
          icon={"Check"}
          onClick={() => {
            apiCard.update(id, settings).then(() => innerNotify())
            setEditing(!editing)
          }}
        />
      )}
      <ConfirmDialog
        open={showDeleteModal}
        prompt={`Delete content "${title}"?`}
        onYes={() => apiCard.remove(id).then(() => notify("card", parent))}
        onClose={() => setShowDeleteModal(false)}
      />
    </DragDrop>
  )
}

export default Content
