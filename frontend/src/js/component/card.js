// TODO:
// - expand cards to match page url

import React, { useEffect, useState } from "react"

import Tags from "component/tags"
import Content from "component/content"
import IconButton from "component/iconbutton"
import { useFetch } from "util"
import { getCard, updateCard } from "api/card"
import { card } from "util/url"

import { block } from "style"
const bss = block("card")

/** attributes: list of all attr
 * returns list of attr with type value
 */
const getAttributes = (attributes, type) =>
  attributes ? attributes.filter(a => a.type === type) : []

const Card = ({ id, data: _data, expanded: _expanded, root, depth = 0 }) => {
  const [data, fetchData, setData] = useFetch(async () => await getCard(id))
  const [expanded, setExpanded] = useState(_expanded)

  const path = `${root || ""}/${id}`
  const looped = path.match(`/${id}/`)

  useEffect(() => {
    if (_data) setData(_data)
    else fetchData()
  }, [id, _data])

  const Children = ({ children }) =>
    children.map(c => {
      if (typeof c === "string") {
        return (
          <Card key={c} id={c} expanded={false} root={path} depth={depth + 1} />
        )
      }
      return c.type === "card" ? (
        <Card key={c.id} id={c.id} data={c} expanded={false} root={path} />
      ) : (
        <Content
          key={c.id}
          id={c.id}
          {...c}
          onChange={d => updateCard(c.id, d).then(fetchData)}
        />
      )
    })

  return data && path ? (
    <div
      className={bss({ size: expanded ? "regular" : "small", root: !root })}
      data-path={path}
      data-id={id}
    >
      <div className={bss("path")}></div>
      <div className={bss("header")}>
        <div className={bss("title")}>
          {data.title}

          {looped ? (
            /* button moves page to where that card is already shown */
            <IconButton
              icon={"ChevronRight"}
              onClick={() => {
                // scroll to that card
                document
                  .querySelector(`.${bss()}[data-id='${id}']`)
                  .scrollIntoView({ behavior: "smooth" })
              }}
            />
          ) : (
            (!data.small ||
              !data.small.show ||
              data.small.show.length < data.children.length) && (
              /* button hides/shows the rest of this cards children */
              <IconButton
                icon={expanded ? "ExpandLess" : "ExpandMore"}
                onClick={() => setExpanded(!expanded)}
              />
            )
          )}
        </div>
        {!looped && (
          <div className={bss("tags")}>
            <Tags
              tags={getAttributes(data.attributes, "tag")}
              size={expanded ? "regular" : "small"}
            />
          </div>
        )}
      </div>
      <div className={bss("children")}>
        {!looped && data.children && (
          <Children
            children={
              !expanded
                ? data.children.filter(
                    c =>
                      data.small && data.small && data.small.show.includes(c.id)
                  )
                : data.children || []
            }
          />
        )}
      </div>
    </div>
  ) : (
    <div className={bss({ loading: true })}>loading</div>
  )
}

export default Card
