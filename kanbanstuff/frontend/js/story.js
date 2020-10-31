import React, { useState, useEffect } from "react"

import { IconButton } from "component/button"
import TextInput from "component/textinput"
import Expandable from "component/expandable"
import User from "feature/user"
import Block from "feature/block"

import * as apiStory from "api/story"

import { css, cx, block } from "style"

const bss = block("story")

const Story = ({ data, expanded: _expanded }) => {
  const [expanded, setExpanded] = useState(_expanded ?? false)

  const [{ _id, title, color, blocks }, update] = apiStory.useUpdate(data)

  const participants = blocks.reduce((arr, block) => {
    if (block.assignee)
      arr.push(
        ...block.assignee.filter(
          user => !arr.some(user2 => user.id === user2.id)
        )
      )
    return arr
  }, [])

  return (
    <div
      className={cx(
        bss({
          expanded
        }),
        css({
          borderColor: color,
          boxShadow: `1px 1px 0px 0px ${color}, 2px 2px 0px 0px ${color}`
        })
      )}
    >
      <div className={bss("title_container")}>
        <TextInput
          className={bss("title")}
          defaultValue={title}
          disabled={!expanded}
          onChange={v => update({ title: v })}
        />
        <IconButton
          icon={`Expand${expanded ? "Less" : "More"}`}
          onClick={() => setExpanded(!expanded)}
        />
      </div>
      <Expandable className={bss("blocks")} expanded={expanded}>
        {blocks.map(block => (
          <Block
            key={block._id}
            data={block}
            onChange={new_block_data => {
              update({
                blocks: [
                  ...blocks.map(b =>
                    b._id === block._id ? { ...b, ...new_block_data } : b
                  )
                ]
              })
            }}
          />
        ))}
        <IconButton
          onClick={() => update({ blocks: [...blocks, { title: "title" }] })}
          label="Add block"
        />
      </Expandable>
      {!expanded && (
        <div className={bss("participants")}>
          {participants.map(user => (
            <User key={user.id} data={user} size={"small"} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Story
