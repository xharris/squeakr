import React, { useEffect, useState } from "react"

import Checkbox from "@material-ui/core/Checkbox"

import Icon from "component/icon"
import TextInput from "component/textinput"
import { IconButton } from "component/button"
import Expandable from "component/expandable"
import User from "feature/user"

import { css, cx, block } from "style"

const bss = block("block")

const Block = ({ data, onChange }) => {
  const [adding, setAdding] = useState()
  const { title, checked, list, assignee } = data

  const [progress, setProgress] = useState(0)
  const updateProgress = () => {
    setProgress(
      list
        ? (list.reduce((prog, item) => {
            return prog + item.checked ? 1 : 0
          }, 0) /
            list.length) *
            100
        : checked
        ? 100
        : 0
    )
  }

  return (
    <div className={bss()}>
      <div className={bss("header")}>
        <div className={bss("title")}>
          <TextInput
            defaultValue={title}
            onChange={v => onChange && onChange({ title: v })}
          />
          {(!list || list.length == 0) && !adding && (
            <IconButton
              icon="Add"
              onClick={() => {
                data.list = []
                setAdding(true)
              }}
            />
          )}
          <IconButton
            icon="Close"
            onClick={() => {
              /* TODO: delete block */
            }}
          />
        </div>
        <div
          className={cx(
            bss("progress"),
            css({
              width: `${progress}%`
            })
          )}
        />
        {assignee && (
          <div className={bss("assignee")}>
            {assignee.map(user => (
              <User key={user.id} data={user} size={"small"} />
            ))}
          </div>
        )}
      </div>
      {list && (list.length > 0 || adding) && (
        <div className={bss("list")}>
          {list.map((item, i) => (
            <div className={bss("list_item")} key={i}>
              <Checkbox
                icon={<Icon icon="CheckBoxOutlineBlank" fontSize="small" />}
                checkedIcon={<Icon icon="CheckBox" fontSize="small" />}
                defaultChecked={item.checked}
                onChange={e => {
                  item.checked = e.target.checked
                  updateProgress()
                }}
              />
              <TextInput
                defaultValue={item.body}
                onChange={v => (item.body = v)}
              />
              <IconButton icon="Close" onClick={() => data.list.splice(i, 1)} />
            </div>
          ))}
          <div className={bss("add_item_container")}>
            <IconButton
              icon={adding ? "Close" : "Add"}
              onClick={() => {
                setAdding(!adding)
              }}
            />
            {adding && <TextInput onChange={v => {}} />}
          </div>
        </div>
      )}
    </div>
  )
}

export default Block
