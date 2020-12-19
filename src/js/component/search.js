import React, { useState, useEffect, useRef } from "react"
import Input from "component/input"
import Button from "component/button"
import { cx, block, css, pickFontColor } from "style"

const bss = block("search")

const re_def_trigger = /[\s\w]+(:)/

const Block = ({ value, onChange, onDelete }) => {
  const el_input = useRef()
  useEffect(() => {
    if (el_input.current) {
      el_input.current.focus()
    }
  }, [el_input])
  return (
    <span className={bss("block")}>
      <span className={bss("block_label")}>{value}</span>
      <Input ref={el_input} size="small" onChange={onChange} />
      <Button icon="Close" onClick={e => onDelete(e)} />
    </span>
  )
}

const Search = ({ blocks, suggestion, placeholder, className }) => {
  const [searching, setSearching] = useState()
  const [terms, setTerms] = useState([])
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState()

  useEffect(() => {
    console.log(value)
  }, [value])

  return searching ? (
    <div className={cx(bss(), className)}>
      <Button
        icon="ArrowBack"
        title="Cancel"
        className={css({
          marginLeft: 3
        })}
        onClick={() => {
          setSearching(false)
        }}
      />
      <Input
        className={bss("input")}
        placeholder={placeholder}
        value={value}
        dirty={value.length > 0 || terms.length > 0}
        onChange={e => {
          setValue(e.target.value)
          if (blocks) {
            console.log(blocks)
            blocks.forEach(b => {
              const match = e.target.value.match(b || re_def_trigger)
              if (match) {
                setTerms([...terms, match.slice(1).join(".")])
                setValue("")
              }
            })
          }
        }}
        onKeyDown={e => {
          const key = e.key
          console.log(key)
          if (
            key === "Backspace" &&
            terms.length > 0 &&
            (!value || value.length === 0)
          ) {
            setTerms(terms.slice(0, -1))
          }
        }}
        onClear={() => setTerms([])}
      >
        {terms.map(t => (
          <Block
            key={t}
            value={t}
            onDelete={() => setTerms(terms.filter(t2 => t2 !== t))}
            onChange={e => {
              if (suggestion) {
              }
            }}
          />
        ))}
      </Input>
      <Button
        icon="Done"
        title="Search"
        className={css({
          marginLeft: 3
        })}
        onClick={() => {
          /* perform search */
        }}
      />
    </div>
  ) : (
    <Button icon="Search" title="Search" onClick={() => setSearching(true)} />
  )
}

export default Search
