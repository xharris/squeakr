import React, { useState, useEffect } from "react"
import * as apiComment from "api/comment"
import Search from "component/search"
import Text from "component/text"
import Box from "component/box"
import Form from "component/form"
import TextArea from "component/textarea"
import Button from "component/button"
import { cx, block, css, pickFontColor } from "style"

const bss = block("commentinput")

const CommentInput = ({
  postid,
  commentid,
  defaultValue,
  onCancel,
  active: _active
}) => {
  const [active, setActive] = useState(_active)
  const editing = defaultValue && defaultValue._id

  return (
    <Box
      className={bss({ active })}
      onClick={e => {
        setActive(true)
      }}
    >
      {active || editing ? (
        <Form
          className={bss("form")}
          data={defaultValue}
          // onChange={setPreviewData}
          onSave={e => {
            const newdata = { ...e, post: postid, comment: commentid }
            editing ? apiComment.update(newdata) : apiComment.add(newdata)
            setActive(false)
            if (onCancel) onCancel()
          }}
        >
          {({ data, setField, setData, Checkbox, SubmitButton }) => [
            <div className={bss("body")} key="body">
              <TextArea
                name="content"
                placeholder="Add text/video/image here..."
                rows="2"
                cols="50"
                onChange={e => setField("content", e.target.value)}
                defaultValue={defaultValue && defaultValue.content}
                acceptFiles
                required
              />
              <div className={bss("footer")}>
                <SubmitButton
                  label={editing ? "Save" : commentid ? "Reply" : "Post"}
                  outlined
                />
                <Button
                  label="Cancel"
                  onClick={e => {
                    setActive()
                    if (onCancel) onCancel()
                    e.stopPropagation()
                  }}
                  outlined
                />
              </div>
            </div>
          ]}
        </Form>
      ) : (
        <Text className={bss("placeholder")} themed>
          Add a comment...
        </Text>
      )}
    </Box>
  )
}

export default CommentInput
