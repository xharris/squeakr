import React, { useRef, useState, useEffect } from "react"

import { css, cx, block } from "style"

const bss = block("expandable")

const Expandable = ({ expanded, className, ...props }) => {
  const [height, setHeight] = useState("auto")
  const [ready, setReady] = useState(false)
  const el_expandable = useRef()

  useEffect(() => {
    if (!ready && el_expandable.current) {
      setHeight(el_expandable.current.offsetHeight)
      setReady(true)
    }
  }, [el_expandable, ready])

  return (
    <div
      className={cx(
        bss(),
        className,
        ready
          ? css({
              maxHeight: expanded ? height : 0,
              margin: !expanded && 0,
              padding: !expanded && 0,
              transition: "ease-in-out max-height 0.2s"
            })
          : css({
              opacity: 0,
              position: "fixed"
            })
      )}
      ref={el_expandable}
      {...props}
    />
  )
}

export default Expandable
