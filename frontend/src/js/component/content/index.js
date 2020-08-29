import React, { useState, useEffect, useContext } from "react"
import { css, cx } from "emotion"

import { IconButton, LinkButton } from "component/button"
import Text from "component/content/text"
import ColorPicker from "component/colorpicker"
import TextInput from "component/textinput"
import ConfirmDialog from "component/modal/confirm"
import { CardContext } from "component/card"
import { DragDrop } from "component/dragdrop"

import { useFetch, dispatch, on, off } from "util"
import * as apiCard from "api/card"
import { block, pickFontColor } from "style"
const bss = block("content")

/*

Content Types:
- Text
- Time (hms, date)


*/

const Content = ({ id, parent, onChange }) => {
  const [data, fetchData] = useFetch(() => apiCard.get(id))
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [settings, setSettings] = useState({
    color: "#ECEFF1"
  })
  const [editing, setEditing] = useState()
  const { fetch: fetchCard } = useContext(CardContext)

  const { type, color, size, title, value } = settings

  useEffect(() => {
    fetchData()

    const onFetchOneContent = e => e.detail.id === id && fetchData()

    on("fetchOneContent", onFetchOneContent)
    return () => {
      off("fetchOneContent", onFetchOneContent)
    }
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
              background-color: ${color};
              color: ${pickFontColor(color)};
            `,
            bss("title")
          )}
        >
          {!editing ? (
            <LinkButton
              key="title"
              onClick={() => setEditing(true)}
              className={css`
                color: ${pickFontColor(color)};
                border-bottom-color: ${pickFontColor(color)} !important;
              `}
            >
              {title}
            </LinkButton>
          ) : (
            <div
              className={cx(
                css`
                  background-color: ${color};
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
                  color: ${pickFontColor(color)};
                  border-bottom: 1px solid ${pickFontColor(color)};
                `}
              />
              <ColorPicker
                name="color"
                defaultValue={color}
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
              ${color ? `border-color: ${color};` : ""}
            `,
            bss("body")
          )}
        >
          {type === "text" ? (
            !editing ? (
              [
                <Text.View key="text.view" value={value} />,
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
            apiCard
              .update(id, settings)
              .then(() => dispatch("fetchOneContent", { detail: { id } }))
            setEditing(!editing)
          }}
        />
      )}
      <ConfirmDialog
        open={showDeleteModal}
        prompt={`Delete content "${title}"?`}
        onYes={() => apiCard.remove(id).then(() => fetchCard())}
        onClose={() => setShowDeleteModal(false)}
      />
    </DragDrop>
  )
}

export default Content
