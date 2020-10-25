import React, { useState } from "react"

import { IconButton } from "component/button"
import Expandable from "component/expandable"
import User from "feature/user"
import Block from "feature/block"

import { css, cx, block } from "style"

const bss = block("story")

const Story = ({ data, expanded: _expanded }) => {
  const [expanded, setExpanded] = useState(_expanded ?? false)
  const { title, color, blocks } = data

  const participants = blocks.reduce((arr, block) => {
    arr.push(
      ...block.assignee.filter(user => !arr.some(user2 => user.id === user2.id))
    )
    return arr
  }, [])

  return (
    <div
      className={cx(
        bss(),
        css({
          borderColor: color,
          boxShadow: `1px 1px 0px 0px ${color}, 2px 2px 0px 0px ${color}`
        })
      )}
    >
      <div className={bss("title_container")}>
        <div className={bss("title")}>{title}</div>
        <IconButton
          icon={`Expand${expanded ? "Less" : "More"}`}
          onClick={() => setExpanded(!expanded)}
        />
      </div>
      <Expandable className={bss("blocks")} expanded={expanded}>
        {blocks.map(block => (
          <Block key={block.id} data={block} />
        ))}
        <IconButton icon="Add" onClick={() => {}} label="Add block" />
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
