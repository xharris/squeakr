import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback
} from "react"
import Input from "component/input"
import Tag from "feature/tag"
import * as apiTag from "api/tag"
import { cx, css, block } from "style"

const bss = block("taginput")

const TagInput = forwardRef(
  ({ className, onChange, floatSuggestions, size, defaultValue }, ref) => {
    const [tags, searchTags] = apiTag.useSearch()
    const [value, setValue] = useState(defaultValue || [])
    const [newValue, setNewValue] = useState("")
    const el_input = useRef()

    useEffect(() => {
      if (onChange) onChange(value || [])
    }, [value])

    useEffect(() => {
      newValue && newValue.length > 0 && searchTags(newValue)
    }, [newValue])

    const addTag = useCallback(
      (t, req) => {
        if (el_input.current) {
          el_input.current.value = ""
          setNewValue("")
          setValue([
            ...value.filter(v => v.value !== t),
            { value: t, request: req }
          ])
          el_input.current.focus()
        }
      },
      [el_input, value]
    )

    return (
      <div className={cx(bss({ floatSuggestions }), className)} ref={ref}>
        <Input
          ref={el_input}
          className={bss("input")}
          placeholder="Tags"
          onChange={e => setNewValue(e.target.value.trim())}
          disabled={value.length >= 3}
          showinput={value.length < 3}
          size={size}
        >
          {value.map(t => (
            <Tag
              className={bss("tag")}
              key={t.value}
              value={t.value}
              onDelete={() => setValue(value.filter(v => v.value !== t.value))}
              request={t.request}
              size="small"
              nolink
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
                  addTag(t.value)
                }}
                size="small"
                nolink
              />
            ))}
          {newValue.length > 0 &&
            (!tags ||
              !tags.some(
                t => t.value.toLowerCase() === newValue.toLowerCase()
              )) && (
              <Tag
                key="newtag"
                request
                value={newValue}
                onClick={() => {
                  addTag(newValue, true)
                }}
                size="small"
                nolink
              />
            )}
        </div>
      </div>
    )
  }
)

export default TagInput
