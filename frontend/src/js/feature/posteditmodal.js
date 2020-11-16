import React, { useState, useEffect } from "react"
import { useAuthContext } from "component/auth"
import { useHistory } from "react-router-dom"
import Dialog from "component/modal"
import Form, { Checkbox } from "component/form"
import TextArea from "component/textarea"
import TagInput from "feature/taginput"
import * as apiPost from "api/post"

import { block } from "style"

const bss = block("posteditmodal")

const PostEditModal = ({ ...props }) => {
  const history = useHistory()
  const [previewData, setPreviewData] = useState()
  const [showPreview, setShowPreview] = useState()
  const addStory = apiPost.useAdd()

  return (
    <Dialog className={bss()} {...props}>
      <Form
        className={bss("form")}
        onChange={setPreviewData}
        onSave={e => addStory(e).then(() => history.go(0))}
      >
        {({ data, setField, Checkbox: FormCheckBox, SubmitButton }) => [
          <div className={bss("header")} key="header">
            <div className={bss("title")}>New Post</div>
            <Checkbox label="preview" onChange={setShowPreview} />
          </div>,
          <div className={bss("body")} key="body">
            <TextArea
              placeholder="Your content here..."
              rows="20"
              cols="50"
              onChange={e => setField("content", e.target.value)}
            />
            <TagInput onChange={v => setField("tags", v)} />
            <div className={bss("options")}>
              <FormCheckBox
                label="Allow comments"
                defaultValue={true}
                onChange={e =>
                  setField("settings", { ...data.settings, can_comment: e })
                }
              />
            </div>
          </div>,
          <div className={bss("footer")} key="footer">
            <SubmitButton label="Post" outlined />
          </div>
        ]}
      </Form>
    </Dialog>
  )
}

export default PostEditModal
