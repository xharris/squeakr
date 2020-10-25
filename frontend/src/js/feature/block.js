import React, { useState } from "react"

import User from "feature/user"

import { css, cx, block } from "style"

const bss = block("block")

const Block = ({ data }) => {
  const { title, assignee } = data

  return (
    <div className={bss()}>
      <div className={bss("header")}>
        <div className={bss("title")}>{title}</div>
        <div className={bss("assignee")}>
          {assignee.map(user => (
            <User key={user.id} data={user} size={"small"} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Block
