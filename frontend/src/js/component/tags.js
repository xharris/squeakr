import React, { useEffect } from "react"

import "style/tags.scss"

const Tags = ({ tags, isMini }) => (
  <div className={`tags${isMini ? " mini" : " "}`}>
    {tags.map(t => (
      <div
        className="tag"
        key={t.value}
        style={{ backgroundColor: `#${t.color}` }}
      >
        {t.value}
      </div>
    ))}
  </div>
)

export default Tags
