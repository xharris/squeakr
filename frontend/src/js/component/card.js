// TODO:
// - expand cards to match page url
// - each content/card has it's own state so that api fetch updates only update that card/content

import React, { useEffect, useState, createContext, useContext } from "react"

import Tags from "component/tags"
import Content from "component/content"
import { IconButton, LinkButton, Icon } from "component/button"
import Form from "component/form"
import ConfirmDialog from "component/modal/confirm"
import AddContentButton from "component/modal/addcontent"
import TextInput from "component/textinput"
import { DragDrop } from "component/dragdrop"
import ColorPicker from "component/colorpicker"
import { CardViewContext } from "view/cardview"

import { useFetch } from "util"
import * as apiCard from "api/card"

import { block, cx, css } from "style"

export const CardContext = createContext({ fetch: () => {} })

const bss = block("card")

/** attributes: list of all attr
 * returns list of attr with type value
 */
const getAttributes = (attributes, type) =>
  attributes ? attributes.filter(a => a.type === type) : []

const Children = ({ root, parent, children, moveChild, depth }) =>
  children
    .reduce((arr, c, i) => {
      var child
      if (typeof c === "string") {
        child = (
          <Card
            key={`child-${c._id}`}
            id={c}
            parent={parent}
            expanded={false}
            root={root}
            depth={depth + 1}
          />
        )
      } else {
        child =
          c.type === "card" ? (
            <Card
              key={`child-${c._id}`}
              id={c._id}
              parent={parent}
              expanded={false}
              root={root}
            />
          ) : (
            <Content key={`child-${c._id}`} id={c._id} parent={parent} />
          )
      }

      arr.push(
        <DragDrop
          info={{ id: parent }}
          className={bss("dropzone")}
          key={`drop1-${c._id}`}
          onDrop={data => moveChild(data, i)}
          accept={["content", "card"]}
        />,
        child
      )

      return arr
    }, [])
    .concat(
      <DragDrop
        info={{ id: parent }}
        className={bss("dropzone")}
        key={`drop2-last`}
        onDrop={data => moveChild(data, children.length - 1)}
        accept={["content", "card"]}
      />
    )

const Card = ({ id, parent, expanded: _expanded, root, depth = 0 }) => {
  const path = `${root || ""}/${id}`
  const looped = path.match(`/${id}/`)

  const { fetch: fetchCards } = useContext(CardViewContext)

  const [data, fetchData] = useFetch(() => apiCard.get(id), "card", id)
  const [expanded, setExpanded] = useState(_expanded)
  const [editing, setEditing] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const moveChild = (info, index) =>
    new Promise((res, rej) => {
      // move/copy from p1 to p2
      if (!info.parent || info.parent !== id) {
        if (!info.parent || info.copy)
          return apiCard.addChild(id, info.id).then(res)
        return apiCard.removeChild(info.parent, info.id).then(res)
      }
      // move/copy from p1 to another place in p1
      if (info.parent === id) {
        if (info.copy);
        else;
      } else res()
    })

  const cardstyle = data
    ? `
    box-shadow: 1px 1px ${data.color}, 2px 2px ${data.color}, 3px 3px ${data.color};
    border: 1px solid ${data.color};
  `
    : ""

  return data && path ? (
    <div
      className={bss({
        root: !root,
        editing,
        looped: looped != null,
        expanded
      })}
      data-path={path}
      data-id={id}
    >
      {!editing ? (
        <DragDrop
          className={cx(bss("header"), css(cardstyle))}
          draggable={!editing}
          info={{ type: "card", id, parent }}
          onDrop={moveChild}
          accept={["content", "card"]}
        >
          <div className={bss("title")}>
            <LinkButton key="title" onClick={() => setEditing(true)}>
              {data.title.length === 0 ? "..." : data.title}
            </LinkButton>
            <div className={bss("actions")}>
              {!looped && (
                <AddContentButton
                  expanded={false /*expanded || data.children.length === 0 */}
                  onSelect={(type, opts) => {
                    setExpanded(true)
                    console.log(type, opts)
                    apiCard.addChild(id, opts)
                  }}
                />
              )}
              {parent && (
                <IconButton
                  title={"remove card from this level"}
                  className={"remove"}
                  icon={"Remove"}
                  onClick={() => apiCard.removeChild(parent, id)}
                />
              )}
              {!looped && (
                <IconButton
                  title={"delete all occurrences of card"}
                  className={"delete"}
                  icon={"Close"}
                  onClick={() => setShowDeleteModal(true)}
                />
              )}
            </div>
          </div>
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
        </DragDrop>
      ) : (
        <div className={cx(bss("editcontainer"), css(cardstyle))}>
          <Form
            onSave={d => apiCard.update(id, d).then(() => setEditing(false))}
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
              />,
              <ColorPicker
                key="color"
                name="color"
                defaultValue={data.color}
                onChange={e => setField("color", e.target.value)}
                className={css`
                  height: 16px;
                  width: 16px;
                  flex: 0 0 18px;
                `}
              />
            ]}
          />
        </div>
      )}
      <div className={bss("children")}>
        {!looped && (
          <div className={bss("tags")}>
            <Tags
              tags={getAttributes(data.attributes, "tag")}
              size={expanded ? "regular" : "small"}
            />
          </div>
        )}
        {!looped && data.children && (
          <CardContext.Provider value={{ fetch: fetchData }}>
            <Children
              root={path}
              parent={id}
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
              moveChild={moveChild}
              depth={depth}
            />
          </CardContext.Provider>
        )}
      </div>
      <ConfirmDialog
        open={showDeleteModal}
        prompt={`Delete card "${data.title}"?`}
        onYes={() => apiCard.remove(id).then(() => fetchCards())}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  ) : (
    <div className={bss({ loading: true })}>loading</div>
  )
}

export default Card
