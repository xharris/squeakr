import React, { useEffect } from "react"

import { block } from "style"
import "style/tags.scss"

const bss = block("tags")

const Tags = ({ tags, isMini }) => (
  <div className={bss({ mini: isMini })}>
    {tags.map(t => (
      <div
        className={bss("tag")}
        key={t.value}
        style={{ backgroundColor: `#${t.color}` }}
      >
        {t.value}
      </div>
    ))}
  </div>
)

export default Tags
