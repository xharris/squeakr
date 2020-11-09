import React, { useState, useEffect } from "react"
import { useAuthContext } from "component/auth"
import Dialog from "component/modal"
import Form, { Checkbox } from "component/form"
import TextArea from "component/textarea"
import TagInput from "feature/taginput"

import { block } from "style"

const bss = block("postmodal")

const PostModal = ({ ...props }) => {
  const [showPreview, setShowPreview] = useState()
  return (
    <Dialog className={bss()} {...props}>
      <Form
        className={bss("form")}
        onSave={e => {
          console.log(e)
        }}
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
            <TagInput onChange={v => setField("tag", v)} />
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

export default PostModal
