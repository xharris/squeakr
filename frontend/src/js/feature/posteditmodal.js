import React, { useState, useEffect } from "react"
import { useAuthContext } from "component/auth"
import { useHistory } from "react-router-dom"
import OverflowDialog from "component/overflowdialog"
import Form, { Checkbox } from "component/form"
import TextArea from "component/textarea"
import TagInput from "feature/taginput"
import Post from "feature/post"
import * as apiPost from "api/post"

import { block } from "style"

const bss = block("posteditmodal")

const PostEditModal = ({ data: defaultValue, ...props }) => {
  const { user } = useAuthContext()
  const history = useHistory()
  const [previewData, setPreviewData] = useState()
  const [showPreview, setShowPreview] = useState()

  useEffect(() => {}, [previewData])

  return (
    <OverflowDialog className={bss()} closeButton {...props}>
      <Form
        className={bss("form")}
        data={defaultValue}
        onChange={setPreviewData}
        onSave={e => {
          const newdata = { ...e }
          if (newdata.tags) newdata.tags = newdata.tags.map(t => t.value)

          defaultValue
            ? apiPost.update(newdata).then(() => history.go(0))
            : apiPost.add(newdata).then(() => history.go(0))
        }}
      >
        {({ data, setField, Checkbox: FormCheckBox, SubmitButton }) => [
          <div className={bss("header")} key="header">
            <div className={bss("title")}>{`${
              defaultValue ? "Edit" : "New"
            } Post`}</div>
            <Checkbox label="preview" onChange={setShowPreview} />
          </div>,
          showPreview && user && (
            <div className={bss("preview_container")} key="prvw">
              <Post
                key="preview"
                theme={user.theme}
                size="small"
                preview={{ ...previewData, date_created: Date.now() }}
              />
              <Post
                theme={user.theme}
                size="full"
                preview={{ ...previewData, date_created: Date.now() }}
              />
            </div>
          ),
          <div
            className={bss("body", { hide: showPreview && !!user })}
            key="body"
          >
            <TextArea
              name="content"
              placeholder="Your content here..."
              rows="20"
              cols="50"
              onChange={e => setField("content", e.target.value)}
              defaultValue={defaultValue && defaultValue.content}
              required
            />
            <TagInput
              onChange={e => setField("tags", e)}
              defaultValue={defaultValue && defaultValue.tags}
            />
            <div className={bss("options")}>
              <FormCheckBox
                label="Allow comments"
                defaultValue={
                  defaultValue ? defaultValue.settings.can_comment : true
                }
                onChange={e =>
                  setField("settings", { ...data.settings, can_comment: e })
                }
              />
            </div>
            <SubmitButton label={defaultValue ? "Save" : "Post"} outlined />
          </div>
        ]}
      </Form>
    </OverflowDialog>
  )
}

export default PostEditModal
