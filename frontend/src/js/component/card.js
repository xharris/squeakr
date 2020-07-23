import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "@material-ui/icons"

import Tags from "component/tags"
import Content from "component/content"
import { useFetch } from "util"
import { getCard } from "api/card"
import { card } from "util/url"

import { block } from "style"
const bss = block("card")

/** attributes: list of all attr
 * returns list of attr with type value
 */
const getAttributes = (attributes, type) =>
  attributes ? attributes.filter(a => a.type === type) : []

const MiniCard = ({ id, title, attributes, child, children }) => (
  <div className={bss({ size: "small" })}>
    <Tags tags={getAttributes(attributes, "tag")} size="small" />

    <div className={bss("left")}>
      <div className={bss("title")}>{title}</div>
      {child && <Content {...child} size="small" />}
    </div>
    <div className={bss("right")}>
      {children.length > 0 && (
        <Link to={card(id)}>
          <ChevronRight />
        </Link>
      )}
    </div>
  </div>
)

const Card = ({ id }) => {
  const [data, fetchData] = useFetch(async () => await getCard(id))
  useEffect(() => {
    fetchData()
  }, [id])

  return data ? (
    <div className={bss({ size: "regular" })}>
      <div className={bss("header")}>
        <div className={bss("title")}>{data.title}</div>
        <div className={bss("tags")}>
          <Tags tags={getAttributes(data.attributes, "tag")} />
        </div>
      </div>
      <div className={bss("children")}>
        {data.children.map(c =>
          c.type === "card" ? (
            <MiniCard key={c.id} {...c} />
          ) : (
            <Content key={c.id} {...c} />
          )
        )}
      </div>
    </div>
  ) : (
    <div className={bss({ loading: true })}>loading</div>
  )
}

export default Card
