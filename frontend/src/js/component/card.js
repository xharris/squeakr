// TODO:
// - expand cards to match page url
// - each content/card has it's own state so that api fetch updates only update that card/content

import React, { useEffect, useState } from "react"

import Tags from "component/tags"
import Content from "component/content"
import { IconButton, LinkButton, Icon } from "component/button"
import Form from "component/form"
import ConfirmDialog from "component/modal/confirm"
import TextInput from "component/textinput"

import { useFetch } from "util"
import * as apiCard from "api/card"

import { block } from "style"
const bss = block("card")

/** attributes: list of all attr
 * returns list of attr with type value
 */
const getAttributes = (attributes, type) =>
  attributes ? attributes.filter(a => a.type === type) : []

const Card = ({
  id: _id,
  data: _data,
  expanded: _expanded,
  root,
  depth = 0,
  fetchCards
}) => {
  const [data, fetchData] = useFetch(() => apiCard.get(id), _data)
  const [expanded, setExpanded] = useState(_expanded)
  const [editing, setEditing] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const id = data ? data._id : _id
  const path = `${root || ""}/${id}`
  const looped = path.match(`/${_data ? _data._id : id}/`)

  useEffect(() => {
    if (_data && _data.type === "card") console.log(_data)
    if (!_data) fetchData()
  }, [id, _data])

  const Children = ({ children }) =>
    children.map(c => {
      if (typeof c === "string") {
        return (
          <Card key={c} id={c} expanded={false} root={path} depth={depth + 1} />
        )
      }
      return c.type === "card" ? (
        <Card key={c._id} id={c._id} data={c} expanded={false} root={path} />
      ) : (
        <Content
          key={c._id}
          id={c._id}
          {...c}
          onChange={d => apiCard.update(c._id, d).then(fetchData)}
        />
      )
    })

  return data && path ? (
    data.type === "card" && (
      <div
        className={bss({
          size: expanded ? "regular" : "small",
          root: !root,
          editing
        })}
        data-path={path}
        data-id={id}
      >
        <div className={bss("path")}></div>

        {!editing && (
          <div className={bss("header")}>
            <div className={bss("title")}>
              <Icon key="menu" icon={"Menu"} className={bss("drag")} />
              <LinkButton key="title" onClick={() => setEditing(true)}>
                {data.title}
              </LinkButton>
              {/*<IconButton
                key="delete"
                icon={"Delete"}
                onClick={() => setShowDeleteModal(true)}
              />
              <ConfirmDialog
                key="del_confirm"
                open={showDeleteModal}
                prompt={`Delete card "${data.title}"?`}
                onYes={() => apiCard.remove(id).then(() => fetchCards())}
                onClose={() => setShowDeleteModal(false)}
              />*/}
              {looped ? (
                /* button moves page to where that card is already shown */
                <IconButton
                  key="goto"
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
                    key="expand"
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
        )}
        <div className={bss(editing ? "editcontainer" : "children")}>
          {!looped &&
            data.children &&
            (editing ? (
              <Form
                onSave={d =>
                  apiCard
                    .update(id, d)
                    .then(() => fetchData())
                    .then(() => setEditing(false))
                }
                render={({ setField }) => [
                  /* button to stop editing card title */
                  <IconButton
                    key="back"
                    icon={"ArrowBack"}
                    onClick={() => {
                      setEditing(false)
                    }}
                  />,
                  <TextInput
                    key="title"
                    onChange={v => setField("title", v)}
                    defaultValue={data.title}
                  />
                ]}
              />
            ) : (
              <Children
                children={
                  !expanded
                    ? data.children.filter(
                        c =>
                          data.small &&
                          data.small &&
                          data.small.show.includes(c.id)
                      )
                    : data.children || []
                }
              />
            ))}
        </div>
      </div>
    )
  ) : (
    <div className={bss({ loading: true })}>loading</div>
  )
}

export default Card
