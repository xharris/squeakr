import React, { useEffect, useState, useRef } from "react"
import { Player, BigPlayButton } from "video-react"
import { block, cx } from "style"
import * as apiFile from "api/file"

const bss = block("video")

const re_video_id = /api\/file\/(\w+)/

const Video = ({ source, type, className, preview }) => {
  const [url, setUrl] = useState()

  useEffect(() => {
    let is_mounted = true
    if (source) {
      const m = source.match(re_video_id)
      if (m) {
        const id = m[1]
        apiFile.get(id).then(res => {
          const enc = new TextEncoder()
          const buf = enc.encode(res)
          if (is_mounted) console.log(buf)
          const bloburl = URL.createObjectURL(new Blob([res], { type }))
          if (is_mounted) setUrl(source)
        })
      }
    }
    return () => {
      is_mounted = false
    }
  }, [source])

  useEffect(() => {
    if (url) console.log(url)
  }, [url])

  return (
    <video controls={!preview} className={cx(bss({ preview }), className)}>
      {source && <source src={source} />}
    </video>
  )
}

export default Video
