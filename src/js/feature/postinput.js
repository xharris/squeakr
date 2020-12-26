import React, { useState, useEffect } from "react"
import * as apiPost from "api/post"
import Search from "component/search"
import Text from "component/text"
import Box from "component/box"
import Form from "component/form"
import TextArea from "component/textarea"
import Button from "component/button"
import * as suggest from "feature/suggestion"
import { cx, block, css, pickFontColor } from "style"

const bss = block("postinput")

const PostInput = ({ defaultValue, onCancel }) => {
  const [active, setActive] = useState()
  const editing = defaultValue && defaultValue._id

  return (
    <Box
      className={bss({ active })}
      onClick={e => {
        setActive(true)
      }}
      themed
    >
      {active || editing ? (
        <Form
          className={bss("form")}
          data={defaultValue}
          // onChange={setPreviewData}
          onSave={e => {
            const newdata = { ...e }
            editing ? apiPost.update(newdata) : apiPost.add(newdata)
            setActive(false)
            onCancel()
          }}
        >
          {({ data, setField, setData, Checkbox, SubmitButton }) => [
            <div className={bss("body")} key="body">
              <TextArea
                name="content"
                placeholder="Add text/video/image here..."
                rows="8"
                cols="50"
                onChange={e => setField("content", e.target.value)}
                defaultValue={defaultValue && defaultValue.content}
                acceptFiles
                required
              />
              <Search
                className={bss("search")}
                placeholder="user: / group:"
                // defaultValue={defaultValue && defaultValue.group}
                blocks={[/\b(user|group):/]}
                suggestion={{
                  user: suggest.user,
                  group: suggest.group
                }}
                onChange={terms => setField("tags", terms)}
                defaultValue={
                  defaultValue && [
                    ...(defaultValue.group
                      ? defaultValue.group.map(g => suggest.toGroup(g.name))
                      : []),
                    ...(defaultValue.mention
                      ? defaultValue.mention.map(u => suggest.toUser(u))
                      : [])
                  ]
                }
                active
              />
              <div className={bss("footer")}>
                <SubmitButton label={editing ? "Save" : "Post"} outlined />
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
          Post something here...
        </Text>
      )}
    </Box>
  )
}

export default PostInput
