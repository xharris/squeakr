import React, { useState, useEffect, createContext, useCallback } from "react"
import Chip from "@material-ui/core/Chip"
import TextField from "@material-ui/core/TextField"

import { IconButton } from "component/button"

import { block } from "style"
const bss = block("form")

const FormContext = createContext({
  onChange: () => {}
})

const Input = ({ label, type, ...props }) => (
  <FormContext.Consumer>
    {({ onChange }) => (
      <TextField
        className={bss("input", { type })}
        label={label}
        variant="outlined"
        size="small"
        margin="dense"
        onChange={e => onChange({ label, value: e.target.value })}
        {...props}
      />
    )}
  </FormContext.Consumer>
)

const Form = ({ render, onSave, onChange }) => {
  const [data, setData] = useState({})
  useEffect(() => {
    if (onChange) onChange(data)
  }, [data])

  const setField = useCallback((label, value) =>
    setData({ ...data, [label]: value })
  )

  return (
    <FormContext.Provider
      className={bss()}
      value={{
        onChange: ({ label, value }) => setField(label, value)
      }}
    >
      {render({ Input, setField })}
      <IconButton
        type="submit"
        icon="Save"
        onClick={() => onSave && onSave(data)}
      />
    </FormContext.Provider>
  )
}

export default Form
