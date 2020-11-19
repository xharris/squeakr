import React, { useState, useEffect, useRef, forwardRef } from "react"
import Input from "component/input"
import Tag from "feature/tag"
import * as apiTag from "api/tag"
import { cx, css, block } from "style"

const bss = block("taginput")

const TagInput = forwardRef(
  ({ className, onChange, floatSuggestions }, ref) => {
    const [tags, searchTags] = apiTag.useSearch()
    const [value, setValue] = useState([])
    const [newValue, setNewValue] = useState()
    const el_input = useRef()

    useEffect(() => {
      if (onChange) onChange(value)
    }, [value])

    useEffect(() => {
      newValue && newValue.length > 0 && searchTags(newValue)
    }, [newValue])

    return (
      <div className={cx(bss({ floatSuggestions }), className)} ref={ref}>
        <Input
          ref={el_input}
          className={bss("input")}
          placeholder="Tags"
          onChange={e => setNewValue(e.target.value)}
        >
          {value.map(t => (
            <Tag
              key={t}
              label={t}
              onDelete={() => setValue(value.filter(v => v !== t))}
            />
          ))}
        </Input>
        <div className={bss("suggestions")}>
          {tags &&
            tags.map(t => (
              <Tag
                {...t}
                key={t._id}
                onClick={() => {
                  if (el_input.current) {
                    el_input.current.value = ""
                    setNewValue()
                    setValue([...value.filter(v => v !== t.value), t.value])
                    el_input.current.focus()
                  }
                }}
              />
            ))}
        </div>
      </div>
    )
  }
)

export default TagInput
