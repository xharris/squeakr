import React, { useEffect } from "react"
import { Link } from "react-router-dom"

import Tags from "component/tags"
import Content from "component/content"

import { useFetch } from "util"
import { getCard } from "api/card"
import { card } from "util/url"

import "style/card.scss"

/** attributes: list of all attr
 * returns list of attr with type value
 */
const getAttributes = (attributes, type) =>
  attributes ? attributes.filter(a => a.type === type) : []

const MiniCard = ({ id, title, attributes }) => (
  <Link to={card(id)} className="mini-card">
    <Tags tags={getAttributes(attributes, "tag")} isMini={true} />
    <div className="title">{title}</div>
  </Link>
)

const Card = ({ id }) => {
  const [data, fetchData] = useFetch(getCard, id)

  const Children = () =>
    data.children ? (
      <div className="children">
        {data.children.map(c => (
          <MiniCard key={c.id} {...c} />
        ))}
      </div>
    ) : null

  useEffect(() => {
    console.log(data)
  }, [data])

  return data ? (
    <div className="card">
      <div className="left">
        <div className="title">{data.title}</div>
        <div className="tags">
          <Tags tags={getAttributes(data.attributes, "tag")} />
        </div>
        {data.content && <Children />}
      </div>
      <div className="right">
        {data.content ? <Content {...data.content} /> : <Children />}
      </div>
    </div>
  ) : (
    <div className="card">loading</div>
  )
}

export default Card
