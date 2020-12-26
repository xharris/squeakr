import React, { useState, useEffect } from "react"
import Avatar from "feature/avatar"
import Text from "component/text"
import Markdown from "component/markdown"
import CommentInput from "feature/commentinput"
import Button from "component/button"
import * as apiComment from "api/comment"
import { useListen, pluralize } from "util"
import { block, cx, css } from "style"

const bss = block("comment")

const Comment = ({ id, showReplies: _showReplies }) => {
  const [data, setData] = useState()
  const [showReplyInput, setShowReplyInput] = useState()
  const [showReplies, setShowReplies] = useState(_showReplies)

  useEffect(() => {
    console.log(showReplies)
  }, [showReplies])

  useEffect(() => {
    if (id) {
      apiComment.get(id).then(res => setData(res.doc))
    }
  }, [id])

  return data ? (
    <div className={bss()}>
      <div className={bss("main")}>
        <Avatar user={data.user} size="small" />
        <Markdown content={data.content} size="full" />
        <Button
          className={bss("reply")}
          icon="Add"
          onClick={() => setShowReplyInput(true)}
        />
      </div>
      {showReplyInput ? (
        <CommentInput
          commentid={data._id}
          active={true}
          onCancel={setShowReplyInput}
        />
      ) : (
        <div className={bss("replies")}>
          {data.comment.length > 0 && (
            <Text
              className={bss("count")}
              amt={40}
              themed
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies
                ? `hide comment${pluralize(data.comment.length, "s")}`
                : `${data.comment.length} comment${pluralize(
                    data.comment.length,
                    "s"
                  )}`}
            </Text>
          )}
          {showReplies && data.comment.map(c => <Comment key={c} id={c} />)}
        </div>
      )}
    </div>
  ) : (
    "..."
  )
}

export default Comment
