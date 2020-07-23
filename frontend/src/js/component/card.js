import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "@material-ui/icons"

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

const MiniCard = ({ id, title, attributes, mini, content, children }) => (
  <div className="mini-card">
    <Tags tags={getAttributes(attributes, "tag")} isMini={true} />

    <div className="left">
      <div className="title">{title}</div>
      {mini && mini.show_content && content && (
        <Content {...content} isMini={true} />
      )}
    </div>
    <div className="right">
      {children.length > 0 && (
        <Link to={card(id)}>
          <ChevronRight />
        </Link>
      )}
    </div>
  </div>
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
        {!data.content && <Children data={data} />}
        <Content {...data.content} />
      </div>
      <div className="right">{data.content && <Children data={data} />}</div>
    </div>
  ) : (
    <div className="card">loading</div>
  )
}

export default Card
