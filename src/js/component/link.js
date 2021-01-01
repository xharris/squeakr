import React, { useState, useEffect } from "react"
import Text from "component/text"
import ReactHtmlParser from "react-html-parser"
import { useThemeContext } from "feature/theme"
import { lookup } from "mime-types"
import Video from "component/video"
import * as apiUtil from "api/util"
import { block, cx, css } from "style"

const re_url = /(.*)(https?:\/\/\S+)(.*)/i
const re_api_image = /\/api\/file\/img\/\w+/i

const bss = block("link")

const preview_scrape_cache = {}
const scrape_cache = {}

const Link = ({
  newtab,
  className,
  href,
  preview,
  alt,
  children,
  bg = "secondary",
  color = "primary",
  amt = 20
}) => {
  const { getColor } = useThemeContext()
  const [metadata, setMetadata] = useState()
  const [data, setData] = useState()
  const [ready, setReady] = useState()
  const [lastHref, setLastHref] = useState()
  const [type, setType] = useState()

  useEffect(() => {
    let cancel = false
    if (type === "link") {
      const cached_res = preview
        ? preview_scrape_cache[href]
        : scrape_cache[href]
      if (cached_res) {
        setData(cached_res)
        setMetadata(cached_res.data)
      } else {
        apiUtil
          .scrape(href, { preview })
          .then(res => {
            if (!cancel) {
              setLastHref(href)
              setData(res.data)
              setMetadata(res.data.data)
              if (preview) {
                preview_scrape_cache[href] = res.data
              } else {
                scrape_cache[href] = res.data
              }
            }
          })
          .finally(() => !cancel && setReady(true))
      }
    } else setReady(true)
    return () => {
      cancel = true
    }
  }, [preview_scrape_cache, scrape_cache, type, href, lastHref])

  useEffect(() => {
    return () => {
      let parent = document.getElementById(`scripts-${encodeURI(href)}`)
      if (parent) parent.parentElement.removeChild(parent)
    }
  }, [])

  useEffect(() => {
    if (href) {
      const mimetype = lookup(href)
      const isurl = re_url.test(href)

      if (re_api_image.test(href)) {
        setType("image")
      } else if (mimetype) {
        if (mimetype.startsWith("video")) setType("video")
        else if (mimetype.startsWith("image")) setType("image")
      } else if (isurl) {
        setType("link")
      } else {
        setType(isurl ? "link" : "other")
      }
    }
  }, [href])

  return !ready && !type ? (
    <div
      className={cx(
        bss({ loading: true }),
        css({
          backgroundColor: getColor("secondary", "secondary")
        })
      )}
    />
  ) : metadata && data ? (
    <div
      className={cx(
        bss({ preview, thumbnail: !!metadata.thumbnail_url }),
        css({
          backgroundImage:
            preview &&
            metadata.thumbnail_url &&
            `url(${metadata.thumbnail_url})`,
          width: metadata.width,
          height: metadata.height,
          maxHeight: preview && 150
        }),
        className
      )}
    >
      {preview && !data.render_preview ? (
        <>
          <Text themed className={bss("title")}>
            {metadata.title}
          </Text>
        </>
      ) : (
        metadata.html &&
        ReactHtmlParser(metadata.html, {
          transform: function (node) {
            if (node.type === "script") {
              let parent = document.getElementById(`scripts-${encodeURI(href)}`)
              if (!parent) {
                parent = document.createElement("div")
                parent.id = `scripts-${encodeURI(href)}`
                document.head.appendChild(parent)
              }
              let el_src = document.createElement("script")
              el_src.src = node.attribs.src
              parent.appendChild(el_src)
            }
          }
        })
      )}
    </div>
  ) : type === "video" ? (
    <Video
      className={bss("video")}
      source={href}
      type={type}
      preview={preview}
    />
  ) : type === "image" ? (
    <img className={bss("image")} src={href} alt={alt || href} loading="lazy" />
  ) : type === "link" ? (
    <a
      className={cx(
        bss(),
        css({
          color: getColor(color, bg, amt)
        }),
        className
      )}
      href={href}
      alt={alt}
      rel={newtab ? "noreferrer" : null}
      target={newtab ? "_blank" : null}
    >
      {children || href}
    </a>
  ) : (
    href
  )
}

export default Link
