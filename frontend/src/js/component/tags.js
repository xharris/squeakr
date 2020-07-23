import React, { useEffect } from "react"

import { block } from "style"

const bss = block("tags")

const Tags = ({ tags, size }) => (
  <div className={bss({ size: size || "regular" })}>
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
