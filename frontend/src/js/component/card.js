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

const Children = ({ data }) =>
  data.children ? (
    <div className="children">
      {data.children.map(c => (
        <MiniCard key={c.id} {...c} />
      ))}
    </div>
  ) : null

const Card = ({ id }) => {
  const [data, fetchData] = useFetch(async () => await getCard(id))
  useEffect(() => {
    fetchData()
  }, [id])

  return data ? (
    <div className="card">
      <div className="left">
        <div className="title">{data.title}</div>
        <div className="tags">
          <Tags tags={getAttributes(data.attributes, "tag")} />
        </div>
        {data.content && <Children data={data} />}
      </div>
      <div className="right">
        {data.content ? (
          <Content {...data.content} />
        ) : (
          <Children data={data} />
        )}
      </div>
    </div>
  ) : (
    <div className="card">loading</div>
  )
}

export default Card
