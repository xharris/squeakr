import React, { useState, useRef, useEffect, useCallback } from "react"
import { cx, css, block } from "style"
import { insertAtCursor } from "util"
import md5 from "util/md5"
import * as apiFile from "api/file"

const bss = block("textarea")

const TextArea = ({
  className,
  color,
  acceptFiles,
  onChange,
  defaultValue,
  ...props
}) => {
  const [droppingFile, setDroppingFile] = useState()
  const [value, setValue] = useState(defaultValue)
  const el_textarea = useRef()

  const replaceFileUrl = useCallback(
    (id, new_url) => {
      if (el_textarea.current) {
        const old_txt = `![${id}](uploading...)`
        const new_txt = `![${id}](${new_url})`
        el_textarea.current.value = el_textarea.current.value.replaceAll(
          old_txt,
          new_txt
        )
        setValue(el_textarea.current.value)
      }
    },
    [el_textarea]
  )

  useEffect(() => {
    if (onChange)
      onChange({
        target: {
          value
        }
      })
  }, [value])

  const onDrop = useCallback(
    e => {
      if (acceptFiles && el_textarea.current) {
        const files = Array.from(e.dataTransfer.files)
        files.forEach(f => {
          f.text().then(t =>
            insertAtCursor(
              el_textarea.current,
              `\n![${f.type}-${f.name}](uploading...)`
            )
          )
          apiFile
            .upload(f)
            .then(res => replaceFileUrl(`${f.type}-${f.name}`, res.data.url))
            .catch(e =>
              replaceFileUrl(`${f.type}-${f.name}`, "failed to upload")
            )
        })
        setDroppingFile(false)
        e.preventDefault()
      }
    },
    [el_textarea, acceptFiles]
  )

  const onDragOver = e => {
    onDrop && setDroppingFile(true)
    e.preventDefault()
    return false
  }

  return (
    <div
      className={cx(
        bss({ dropping: droppingFile }),
        className,
        css({
          [":hover"]: {
            border: `1px solid ${color || "#bdbdbd"}`,
            boxShadow: `0px 0px 3px 1px ${color || "#bdbdbd"}`
          }
        })
      )}
      onDrop={onDrop}
    >
      {droppingFile && <div className={bss("drop")}>Drop file to upload</div>}
      <textarea
        ref={el_textarea}
        className={bss("textarea")}
        {...props}
        value={value}
        onChange={e => setValue(e.target.value)}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={e => setDroppingFile(false)}
      />
    </div>
  )
}

export default TextArea
